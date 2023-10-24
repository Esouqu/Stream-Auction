<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Donation from '$lib/components/Donation.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import type { IDonationData, IRoute, ITwitchRedeemedReward } from '$lib/interfaces';
	import donations from '$lib/stores/donations';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_Color.svg';
	import twitchIcon from '$lib/assets/twitch-logo/TwitchGlitchPurple.svg';
	import Switch from '$lib/components/Switch.svelte';
	import {
		addTimeOnNewItem,
		addTimeOnNewLeader,
		additionSpinTimePrice,
		additionSpinTimePriceStep,
		additionSpinTime,
		stopSpin,
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
	import { onMount } from 'svelte';

	let activeRoute: IRoute;
	let daSession: string = $page.data.daSession;
	let twitchSession: string = $page.data.twitchSession;
	let isConnectingToDonationAlerts = false;
	let isConnectingToTwitch = false;
	let donationAlertsWebSocket: WebSocket;
	let twitchWebSocket: WebSocket;

	$: $lots, addCountdownTime();

	onMount(() => {
		const validationInterval = 1000 * 60 * 60;
		let validationIntervalId: NodeJS.Timeout;

		validationIntervalId = setInterval(async () => {
			await fetch('/api/twitch/validate');
		}, validationInterval);

		return () => clearInterval(validationIntervalId);
	});

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

	function addSpinTime(donationValue: number) {
		const time = $additionSpinTime.value;
		const currentMinDonation = Number($additionSpinTimePrice.value);
		const minDonationStep = Number($additionSpinTimePriceStep.value);

		if (donationValue < currentMinDonation) return;

		$additionSpinTimePrice.value = currentMinDonation + minDonationStep;
		timer.add(Number(time) * 1000);
		wheel.addSpinDuration(Number(time) * 1000);

		// if (minDonationIsToggled && donationValue >= currentMinDonation) {
		//   if ($addWheelSpinTimeMinDonationPriceStep.isToggled) {
		//     const minDonationStep = Number($addWheelSpinTimeMinDonationPriceStep.value);
		//     $addWheelSpinTimeMinDonationPrice.value = String(currentMinDonation + minDonationStep);
		//   }

		//   timer.add(Number(time) * 1000);
		//   wheel.addSpinDuration(Number(time) * 1000);
		// } else if (minDonationIsToggled) {
		//   timer.add(Number(time) * 1000);
		//   wheel.addSpinDuration(Number(time) * 1000);
		// }
	}

	function twitchSwitchOn() {
		isConnectingToTwitch = true;

		if (twitchSession) {
			connectToTwitchSocket();
		} else {
			goto('/api/twitch/auth');
		}
	}

	function daSwitchOn() {
		isConnectingToDonationAlerts = true;

		if (daSession) {
			connectToDonationAlertsSocket();
		} else {
			goto('/api/da/auth');
		}
	}

	function processIdDonation(lotId: RegExpMatchArray, amount: number, username: string) {
		const id = Number(lotId[0].replace('#', ''));
		const isEnoughAmount = amount >= Number($stopSpin.value);

		for (const l of $lots) {
			if (l.id !== id) continue;

			lots.addValue(id, amount, username);
			events.add(`+${amount}: ${l.title}`);
		}

		if ($stopSpin.isToggled && $wheel.isSpinning && isEnoughAmount) {
			wheel.stop();
			timer.reset();
		}
	}

	function precessUrlDonation(donation: IDonationData) {
		const isEnoughAmount = donation.amount >= Number($stopSpin.value);

		if (!$wheel.isSpinning) {
			donations.add({
				...donation,
				amount_in_user_currency: donation.amount
			});
		} else {
			lots.add(donation.message, donation.amount, donation.username);
			events.add(`${donation.message}`, 'add');

			if ($stopSpin.isToggled && isEnoughAmount) {
				wheel.stop();
				timer.reset();
			}
		}
	}

	function processDonation(donation: IDonationData) {
		const amount = donation.amount_in_user_currency;
		const lotId = donation.message.match(/\B(\#[\d]+\b)(?!;)/);
		const haveUrl = isUrl(donation.message);
		const isEnoughAmount = amount >= Number($stopSpin.value);

		if ($wheel.isSpinning && $additionSpinTime.isToggled) {
			addSpinTime(amount);
		}

		if (lotId) {
			processIdDonation(lotId, amount, donation.username);

			return;
		}

		if (haveUrl) {
			precessUrlDonation({ ...donation, amount_in_user_currency: amount });

			return;
		}

		const minMergeThreshold = 40;
		const maxMergeThreshold = 60;

		let acceptableLots = [];
		let mostSimilarLot = null;

		for (const l of $lots) {
			const comparePercent = compareStrings(donation.message, l.title);

			if (comparePercent > maxMergeThreshold) {
				lots.addValue(l.id, amount, donation.username);
				events.add(`+${amount}: ${l.title}`);
				acceptableLots = [];

				if ($stopSpin.isToggled && $wheel.isSpinning && isEnoughAmount) {
					wheel.stop();
					timer.reset();
				}

				return;
			}

			if ($stopSpin.isToggled && $wheel.isSpinning && isEnoughAmount) {
				lots.add(donation.message, amount, donation.username);
				events.add(`${donation.message}`, 'add');

				wheel.stop();
				timer.reset();

				return;
			}

			if (comparePercent > minMergeThreshold) {
				acceptableLots.push({
					...l,
					comparePercent
				});
			}
		}

		if (acceptableLots.length > 0) {
			mostSimilarLot = acceptableLots.reduce((prev, current) =>
				prev.comparePercent > current.comparePercent ? prev : current
			);
		}

		donations.add({ ...donation, mostSimilarLot });
	}

	async function connectToTwitchSocket() {
		const pingIntervalInMin = 1000 * 60;
		const reconnectInterval = 1000 * 3;
		const twitchChannel = await fetch('/api/twitch/user')
			.then((res) => res.json())
			.then((data) => data);

		let heartbeatInterval: NodeJS.Timeout;
		let rewardId: string;

		twitchWebSocket = new WebSocket('wss://pubsub-edge.twitch.tv');

		function heartbeat() {
			twitchWebSocket.send(
				JSON.stringify({
					type: 'PING'
				})
			);
		}

		twitchWebSocket.addEventListener('open', async () => {
			// console.log('Twitch WebSocket connection opened');
			twitchWebSocket.send(
				JSON.stringify({
					type: 'LISTEN',
					data: {
						topics: [`channel-points-channel-v1.${twitchChannel}`],
						// auth_token: '8d5170babd45d7f'
						auth_token: twitchSession
					}
				})
			);

			// const session = await fetch('http://localhost:8080/units/clients')
			// 	.then((res) => res.json())
			// 	.then((data) => console.log(data));
			rewardId = await fetch(`/api/twitch/rewards?broadcaster_id=${twitchChannel}`, {
				method: 'POST',
				headers: {
					// Authorization: `Bearer 8d5170babd45d7f`
					Authorization: `Bearer ${twitchSession}`
				}
			})
				.then((res) => res.json())
				.then((data) => data.data[0].id);

			console.log(rewardId);

			heartbeat();
			heartbeatInterval = setInterval(() => {
				heartbeat();
			}, pingIntervalInMin);
		});
		twitchWebSocket.addEventListener('message', (event) => {
			// console.log(JSON.parse(event.data));
			const message = JSON.parse(event.data);

			if (message.type === 'RECONNECT') {
				setTimeout(connectToTwitchSocket, reconnectInterval);
			}

			if (message.type === 'RESPONSE' && message.error === '') {
				isConnectingToTwitch = false;
			}

			if (message.type === 'reward-redeemed' && rewardId === message.data.redemption.reward.id) {
				const redeemedReward: ITwitchRedeemedReward = message.data;
				const id = redeemedReward.redemption.id;
				const username = redeemedReward.redemption.user.display_name;
				const input = redeemedReward.redemption.user_input;
				const amount = redeemedReward.redemption.reward.cost;
				const createdAt = redeemedReward.redemption.redeemed_at;

				processDonation({
					id,
					username,
					amount,
					amount_in_user_currency: amount,
					message: input,
					currency: '',
					created_at: createdAt.toString(),
					mostSimilarLot: null
				});
			}
		});
		twitchWebSocket.addEventListener('close', () => {
			// console.log('WebSocket connection closed');

			clearInterval(heartbeatInterval);
		});
		twitchWebSocket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
		});
	}

	async function connectToDonationAlertsSocket() {
		const donationAlertsUser = await fetch('/api/da/user')
			.then((res) => res.json())
			.then((data) => data);

		donationAlertsWebSocket = new WebSocket(
			'wss://centrifugo.donationalerts.com/connection/websocket'
		);

		donationAlertsWebSocket.addEventListener('open', () => {
			donationAlertsWebSocket.send(
				JSON.stringify({
					params: {
						token: donationAlertsUser.socket_connection_token
					},
					id: 1
				})
			);
		});
		donationAlertsWebSocket.addEventListener('message', async (event) => {
			const message = JSON.parse(event.data);
			// console.log(message);

			if (message.id === 1) {
				const socketToken = await fetch('/api/da/pubsub', {
					method: 'POST',
					body: JSON.stringify({
						channels: [`$alerts:donation_${donationAlertsUser.id}`],
						client: message.result.client
					})
				}).then((res) => res.json());

				donationAlertsWebSocket.send(
					JSON.stringify({
						params: {
							channel: `$alerts:donation_${donationAlertsUser.id}`,
							token: socketToken
						},
						method: 1,
						id: 2
					})
				);

				isConnectingToDonationAlerts = false;
			}

			if (
				!message.result.type &&
				message.result.channel === `$alerts:donation_${donationAlertsUser.id}`
			) {
				const donation: IDonationData = message.result.data.data;
				const username = donation.username ?? 'Аноним';
				const roundedAmount = Math.round(donation.amount_in_user_currency);

				processDonation({ ...donation, username, amount_in_user_currency: roundedAmount });
			}
		});
		donationAlertsWebSocket.addEventListener('close', () => {
			// console.log('WebSocket connection closed');
		});
		donationAlertsWebSocket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
		});
	}
</script>

<div class="layout">
	<div class="layout-section layout-section_left">
		<h1 style="font-size: 28px;">Правила Аукциона</h1>
		<!-- <h2 style="font-size: 28px;">По умолчанию</h2> -->
		{#if $additionSpinTime.isToggled}
			<h3 style="font-size: 28px; text-align: center;">
				Продлениe прокрута <br />
				{$additionSpinTimePrice.value}
				{$additionSpinTimePrice.valueAttribute}
			</h3>
		{/if}
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
						<img src={daIcon} alt="Donationalerts logo" />
						<p>Donation Alerts</p>
						{#if daSession}
							<Switch
								color="orange"
								on={daSwitchOn}
								off={() => donationAlertsWebSocket.close()}
								isDisabled={isConnectingToDonationAlerts}
							/>
						{:else}
							<TextButton
								text="Авторизоваться"
								color="gradient"
								on:click={() => goto('/api/da/auth')}
							/>
						{/if}
					</div>
					<div class="integration">
						<img src={twitchIcon} alt="Twitch logo" />
						<p>Twitch</p>
						{#if twitchSession}
							<Switch color="purple" on={twitchSwitchOn} off={() => twitchWebSocket.close()} />
						{:else}
							<TextButton
								text="Авторизоваться"
								color="gradient"
								on:click={() => goto('/api/twitch/auth')}
							/>
						{/if}
					</div>
				</div>
			</div>
			<div class="donations-scroll-wrapper">
				<div class="donations-wrapper" data-donations-queue={$donations.length}>
					{#each $donations as { id, username, message, amount, amount_in_user_currency, currency, mostSimilarLot }}
						<Donation
							{id}
							{username}
							{message}
							{amount}
							{amount_in_user_currency}
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
			position: relative;
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
				overflow: hidden;
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
			flex-direction: column;
			align-items: center;
			gap: 20px;
		}

		& img {
			height: 30px;
			object-fit: contain;
			transition: 0.2s;
		}
	}
</style>
