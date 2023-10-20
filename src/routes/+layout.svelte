<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Donation from '$lib/components/Donation.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import type { IDonationData, IRoute } from '$lib/interfaces';
	import donations from '$lib/stores/donations';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_Color.svg';
	import twitchIcon from '$lib/assets/twitch-logo/TwitchGlitchPurple.svg';
	import Switch from '$lib/components/Switch.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { PUBLIC_DA_CLIENT_ID } from '$env/static/public';
	import {
		addTimeOnNewItem,
		addTimeOnNewLeader,
		addWheelSpinTimeOnDonation,
		stopWheelOnDonation,
		textRules
	} from '$lib/stores/settings';
	import Popup from '$lib/components/Popup.svelte';
	import { fade } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import { compareStrings, isUrl } from '$lib/utils';
	import wheel from '$lib/stores/wheel';
	import timer from '$lib/stores/timer';
	import TextButton from '$lib/components/TextButton.svelte';
	import Event from '$lib/components/Event.svelte';
	import events from '$lib/stores/events';

	const userId = $page.data.userId;
	const redirectUrl = 'http://localhost:5173/redirect';
	const scope = 'oauth-user-show+oauth-donation-subscribe';
	const queryParams = `client_id=${PUBLIC_DA_CLIENT_ID}&redirect_url=${redirectUrl}&response_type=code&scope=${scope}`;
	const authorizeUrl = `https://www.donationalerts.com/oauth/authorize?${queryParams}`;
	// const twitchClient = 'oyo39c1yw5jrvnonhqtj8rwf26a70i';
	// const scope = 'channel%3Amanage%3Aredemptions+channel%3Aread%3Aredemptions';
	// const authorizeUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;

	let activeRoute: IRoute;
	let socket: WebSocket;
	let connectionToken: string;
	let isConnecting = false;

	$: $lots, addSpinTime(), addCountdownTime();

	function addCountdownTime() {
		if (!$timer.isRunning) return;

		const newItemTime = $addTimeOnNewItem.value;
		const newLeaderTime = $addTimeOnNewLeader.value;

		if ($addTimeOnNewItem.isToggled && !$wheel.isSpinning) {
			lots.onNewItem(() => {
				timer.add(Number(newItemTime) * 1000);
			});
		}
		if ($addTimeOnNewLeader.isToggled && !$wheel.isSpinning) {
			lots.onNewLeader(() => {
				timer.add(Number(newLeaderTime) * 1000);
			});
		}
	}

	function addSpinTime() {
		if (!$wheel.isSpinning || !$addWheelSpinTimeOnDonation.isToggled) return;

		const addDonationTime = $addWheelSpinTimeOnDonation.value;

		timer.add(Number(addDonationTime) * 1000);
		wheel.addSpinDuration(Number(addDonationTime) * 1000);
	}

	function switchOn() {
		if ($page.data.socketToken && !socket) {
			makeWebsocketConnection();
		} else {
			goto(authorizeUrl);
		}
	}

	function makeWebsocketConnection() {
		socket = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');

		socket.addEventListener('open', () => {
			// console.log('WebSocket connection opened');
			socket.send(
				JSON.stringify({
					params: {
						token: $page.data.socketToken
					},
					id: 1
				})
			);
		});
		socket.addEventListener('message', async (event) => {
			// console.log(JSON.parse(event.data));
			const { result } = JSON.parse(event.data);

			if (!connectionToken) {
				isConnecting = true;

				connectionToken = await fetch('/api/da/pubsub', {
					method: 'POST',
					body: JSON.stringify({
						channels: [`$alerts:donation_${userId}`],
						client: result.client
					})
				}).then((res) => res.json());

				socket.send(
					JSON.stringify({
						params: {
							channel: `$alerts:donation_${userId}`,
							token: connectionToken
						},
						method: 1,
						id: 2
					})
				);

				isConnecting = false;
			}

			if (!result.type && result.channel === `$alerts:donation_${userId}`) {
				const donation: IDonationData = result.data.data;
				const isEnoughValue = donation.amount_in_user_currency > Number($stopWheelOnDonation.value);
				const isUrlMessage = isUrl(donation.message);
				const minPercentForMerge = 40;
				const maxPercentForMerge = 60;

				let minPercentsForMerge = [];
				let mostSimilarLot = null;

				for (const l of $lots) {
					const comparePercent = compareStrings(donation.message, l.title);

					if (isUrlMessage && !$wheel.isSpinning) {
						donations.add(donation);

						return;
					} else if ($wheel.isSpinning && isUrlMessage) {
						lots.add(donation.message, donation.amount_in_user_currency, donation.username);
						events.add(`${donation.message}`, 'add');

						return;
					}

					// stop wheel on donation
					if ($stopWheelOnDonation.isToggled && $wheel.isSpinning && isEnoughValue) {
						// donations.remove(donation.id);
						if (comparePercent > maxPercentForMerge) {
							lots.addValue(l.id, donation.amount_in_user_currency);
							events.add(`+${donation.amount_in_user_currency}: ${l.title}`);
						} else {
							lots.add(donation.message, donation.amount_in_user_currency, donation.username);
							events.add(`${donation.message}`, 'add');
						}

						wheel.stop();
						timer.reset();

						return;
					}

					if (comparePercent > maxPercentForMerge) {
						lots.addValue(l.id, donation.amount_in_user_currency);
						events.add(`+${donation.amount_in_user_currency}: ${l.title}`);
						minPercentsForMerge = [];

						return;
					} else if (comparePercent > minPercentForMerge) {
						minPercentsForMerge.push({
							comparePercent,
							...l
						});
					}
				}

				if (minPercentsForMerge.length > 0) {
					mostSimilarLot = minPercentsForMerge.reduce((prev, current) => {
						if (prev.comparePercent > current.comparePercent) {
							return prev;
						} else {
							return current;
						}
					});
				}

				donations.add({ ...donation, mostSimilarLot });
			}
		});
		// socket.addEventListener('close', () => {
		// 	console.log('WebSocket connection closed');
		// });
		// socket.addEventListener('error', (event) => {
		// 	console.error('WebSocket error:', event);
		// });

		return socket;
	}
</script>

<div class="layout" transition:fade>
	<div class="layout-section layout-section_left">
		<h1 style="font-size: 28px;">Правила Аукциона</h1>
		<!-- <h2 style="font-size: 28px;">По умолчанию</h2> -->
		<h3 style="white-space: break-spaces; font-size: 24px;">
			{JSON.parse(JSON.stringify($textRules))}
		</h3>
	</div>
	<div class="layout-section layout-section_center">
		<div class="layout-section-wrapper">
			<slot />
		</div>
		<div class="navigation-wrapper">
			<Navigation bind:activeRoute />
		</div>
	</div>
	<div class="layout-section layout-section_right">
		<div class="layout-wrapper">
			<Timer />
			<div class="integration-wrapper">
				<p>Интеграции</p>
				<div class="integration-buttons">
					<div class="integration">
						{#if isConnecting}
							<Loader --loader-color="#ffffff" --loader-dur="1s" --loader-size="24px" />
						{/if}
						<img class:small={isConnecting} src={daIcon} alt="" />
						{#if $page.data.userId}
							<Switch on={switchOn} isDisabled={isConnecting} />
						{/if}
					</div>
					<div class="integration">
						<img src={twitchIcon} alt="" />
						{#if $page.data.userId}
							<Switch --switch-color="var(--color-purple)" isDisabled={true} />
						{/if}
					</div>
					{#if !$page.data.userId}
						<TextButton
							text="Авторизоваться"
							color="gradient"
							on:click={() => goto(authorizeUrl)}
						/>
					{/if}
				</div>
			</div>
			<div class="donations-scroll-wrapper">
				<div class="donations-wrapper" data-donations-queue={$donations.length}>
					{#each $donations as { id, username, message, amount_in_user_currency, currency, mostSimilarLot }}
						<Donation
							{id}
							{username}
							{message}
							amount={amount_in_user_currency}
							{currency}
							{mostSimilarLot}
						/>
					{/each}
					{#each $events as event}
						<Event {...event} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.layout {
		display: grid;
		grid-template-columns: 1fr minmax(960px, 1fr) 1fr;

		&-wrapper {
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: 10px;
			height: 100%;
			padding: 20px;
		}
		&-section-wrapper {
			display: flex;
			justify-content: center;
			flex: 1 1 0;
			width: 100%;
		}
		&-section {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
			color: white;

			&_center {
				justify-content: space-between;
				padding: 30px 0;
				box-shadow: 0px 4px 15px black;
				background-color: rgb(20 20 20 / 40%);
			}
			&_right {
				align-items: stretch;
				padding: 0;
			}
		}
	}
	.donations {
		&-wrapper {
			display: flex;
			flex-direction: column;
			gap: 10px;

			&::before {
				content: 'Очередь (' attr(data-donations-queue) ')';
				margin: 8px 0;
				font-size: 18px;
				font-weight: 600;
				text-align: center;
			}
		}

		&-scroll-wrapper {
			display: flex;
			justify-content: center;
			align-items: start;
			flex: 1 1 0;
			padding: 20px;
			overflow-y: auto;
			overflow-x: hidden;
			scrollbar-gutter: stable;
		}
	}
	.navigation-wrapper {
		padding: 50px 0 0 0;
	}
	.integration {
		position: relative;
		display: flex;
		align-items: center;
		gap: 10px;

		&-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 20px;
			padding: 20px;
			min-width: 350px;
			max-width: 350px;
			box-shadow: 0px 3px 8px black;
			background-color: rgb(20 20 20 / 40%);

			& p {
				margin: 0;
				text-align: center;
				font-size: 18px;
				font-weight: 600;
			}
		}
		&-buttons {
			display: flex;
			gap: 20px;
		}

		& img {
			height: 30px;
			object-fit: contain;
			transition: 0.2s;

			&.small {
				height: 15px;
			}
		}
	}
</style>
