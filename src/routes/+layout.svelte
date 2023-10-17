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
	import { textRules } from '$lib/stores/settings';
	import Popup from '$lib/components/Popup.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';

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
	let isDisabled = false;
	let isLoggedIn = false;

	onMount(() => {
		if (browser) localStorage.clear();
	});

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
				isDisabled = true;

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

				isDisabled = false;
			}
			if (!result.type && result.channel === `$alerts:donation_${userId}`) {
				const donation: IDonationData = result.data.data;

				donations.add(donation);
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

{#if isLoggedIn}
	<div class="layout" transition:fade>
		<div class="layout-section layout-section_left">
			<h1>Правила Аукциона</h1>
			<h2>Аук на Все</h2>
			<h3 style="white-space: break-spaces;">
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
			<Timer />
			<div class="integration-wrapper">
				<p>Интеграции</p>
				<div class="integration-buttons">
					<div class="integration">
						{#if isDisabled}
							<Loader --loader-color="#ffffff" --loader-dur="1s" --loader-size="24px" />
						{/if}
						<img class:small={isDisabled} src={daIcon} alt="" />
						{#if $page.data.userId}
							<Switch on={switchOn} {isDisabled} />
						{/if}
					</div>
					<div class="integration">
						<img src={twitchIcon} alt="" />
						{#if $page.data.userId}
							<Switch --switch-color="var(--color-purple)" isDisabled={true} />
						{/if}
					</div>
					{#if !$page.data.userId}
						<button type="button" on:click={() => goto(authorizeUrl)} class="auth-button">
							Авторизоваться
						</button>
					{/if}
				</div>
			</div>
			<div class="donations-scroll-wrapper">
				<div class="donations-wrapper" data-donations-queue={$donations.length}>
					{#each $donations as { id, username, message, amount_in_user_currency, currency }}
						<Donation {id} {username} {message} amount={amount_in_user_currency} {currency} />
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		style="display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; width: 100%;"
	>
		<h1>Доступно только по подписке</h1>
		<button type="button" on:click={() => (isLoggedIn = !isLoggedIn)} style="font-size: 20px;">
			Арчидос. Подписаться
		</button>
	</div>
{/if}

<style lang="scss">
	.auth-button {
		border: 0;
		border-radius: 10px;
		padding: 5px 10px;
		font-family: 'Nunito Sans';
		font-size: 18px;
		font-style: normal;
		font-weight: 600;
		text-shadow: rgb(0, 0, 0) 0px 2px 0px;
		color: #fff;
		background: linear-gradient(90deg, #f57d07 0.32%, #9146ff 100.32%);
		transition: 0.3s;
		cursor: pointer;

		&:hover {
			filter: brightness(1.2);
		}
	}
	.layout {
		display: grid;
		grid-template-columns: 1fr minmax(960px, 1fr) 1fr;

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
				padding: 0;
				box-shadow: 0px 4px 15px black;
				background-color: #141414;
			}
			&_right {
				align-items: stretch;
				padding: 20px 0;
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
		padding: 50px 0 20px 0;
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

			& p {
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
