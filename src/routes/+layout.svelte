<script lang="ts">
	import type { IDonationData, IRoute, ITwitchRedeemedReward } from '$lib/interfaces';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly, slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { NAVIGATION_ROUTES } from '$lib/constants';
	import { getTotal } from '$lib/utils';
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import backgroundImage from '$lib/stores/backgroundImage';
	import Donation from '$lib/components/Donation.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import Integration from '$lib/components/Integration.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import TransitionContainer from '$lib/components/TransitionContainer.svelte';
	import TestKit from '$lib/components/TestKit.svelte';
	import LotPreview from '$lib/components/LotPreview.svelte';
	import textRules from '$lib/stores/textRules';
	import Textarea from '$lib/components/Textarea.svelte';
	import subscribeStores from '$lib/stores/storesBus';

	const customRewardTitle = 'Stream Auction - Бесплатный Заказ';

	let activeRoute: IRoute;
	let previousRoute: IRoute;
	let daSession: string = $page.data.daSession;
	let twitchSession: string = $page.data.twitchSession;
	let isConnectingToDonationAlerts = false;
	let isConnectingToTwitch = false;
	let isTwitchToggled = false;
	let donationAlertsWebSocket: WebSocket;
	let twitchWebSocket: WebSocket;

	let isTotalShown = false;
	let isTextRulesEditable = false;

	$: stopSpinAction = donations.stopSpinAction;
	$: continueSpinAction = donations.continueSpinAction;
	$: currentSpinPrice = donations.currentSpinPrice;
	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
	$: topLots = sortedLots.slice(0, 10);
	$: total = getTotal($lots.map((l) => l.value));

	onMount(() => {
		const validationInterval = 1000 * 60 * 60;
		let validationIntervalId: NodeJS.Timeout;

		subscribeStores();

		if (twitchSession) {
			validationIntervalId = setInterval(async () => {
				await fetch('/api/twitch/validate');
			}, validationInterval);

			return () => clearInterval(validationIntervalId);
		}
	});

	function getFlyDirection() {
		if (!previousRoute || !activeRoute) return;

		const diff = Math.abs(previousRoute.id - activeRoute.id);
		const isPastRouteSmaller = previousRoute.id < activeRoute.id;
		const baseDistance = 300;
		const moveDistance = baseDistance * diff;

		return {
			forward: isPastRouteSmaller ? moveDistance : -moveDistance,
			backward: isPastRouteSmaller ? -moveDistance : moveDistance
		};
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

	async function getCustomRewardId(twitchChannel: number) {
		let rewardId;

		const existedRewards = await fetch(`/api/twitch/rewards?broadcaster_id=${twitchChannel}`)
			.then((res) => res.json())
			.then((data) => data.data);

		for (const reward of existedRewards) {
			if (reward.title === customRewardTitle) {
				rewardId = reward.id;
			}
		}

		if (!rewardId) {
			rewardId = await fetch(`/api/twitch/rewards?broadcaster_id=${twitchChannel}`)
				.then((res) => res.json())
				.then((data) => data.data[0].id);
		}

		return rewardId;
	}

	async function connectToTwitchSocket() {
		const pingIntervalInMin = 1000 * 60;
		const reconnectInterval = 1000 * 3;
		const twitchChannel = await fetch('/api/twitch/user')
			.then((res) => res.json())
			.then((data) => data);
		const rewardId = await getCustomRewardId(twitchChannel);
		let heartbeatInterval: NodeJS.Timeout;

		twitchWebSocket = new WebSocket('wss://pubsub-edge.twitch.tv');

		function heartbeat() {
			twitchWebSocket.send(
				JSON.stringify({
					type: 'PING'
				})
			);
		}

		twitchWebSocket.addEventListener('open', async () => {
			twitchWebSocket.send(
				JSON.stringify({
					type: 'LISTEN',
					data: {
						topics: [`channel-points-channel-v1.${twitchChannel}`],
						auth_token: twitchSession
					}
				})
			);

			heartbeat();
			heartbeatInterval = setInterval(() => {
				heartbeat();
			}, pingIntervalInMin);
		});
		twitchWebSocket.addEventListener('message', (event) => {
			const message = JSON.parse(event.data);

			if (message.type === 'RECONNECT') {
				setTimeout(connectToTwitchSocket, reconnectInterval);
			}

			if (message.type === 'RESPONSE') {
				isConnectingToTwitch = false;

				if (message.error === 'ERR_BADMESSAGE') {
					isTwitchToggled = false;
				}
			}

			if (message.type === 'MESSAGE') {
				const data = JSON.parse(message.data.message);
				const messageRewardId = data.data.redemption.reward.id;

				if (data.type === 'reward-redeemed' && rewardId === messageRewardId) {
					const redeemedReward: ITwitchRedeemedReward = data.data;
					const id = redeemedReward.redemption.id;
					const username = redeemedReward.redemption.user.display_name;
					const message = redeemedReward.redemption.user_input;
					const amount = redeemedReward.redemption.reward.cost;
					const createdAt = redeemedReward.redemption.redeemed_at;

					donations.add({
						id,
						type: 'Twitch',
						username,
						amount,
						amount_in_user_currency: amount,
						message,
						currency: 'TP',
						created_at: createdAt.toString(),
						mostSimilarLot: null,
						isInstant: false
					});
				}
			}
		});
		twitchWebSocket.addEventListener('close', () => {
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

				donations.add({
					id: donation.id,
					type: 'Donation Alerts',
					username,
					amount: donation.amount,
					amount_in_user_currency: roundedAmount,
					message: donation.message,
					currency: donation.currency,
					created_at: donation.created_at,
					mostSimilarLot: null,
					isInstant: false
				});
			}
		});
		donationAlertsWebSocket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
		});
	}
</script>

<div class="layout" style="background-image: {$backgroundImage};">
	<div class="layout-section layout-section_left">
		<div class="layout-wrapper">
			{#if activeRoute?.url === NAVIGATION_ROUTES.WHEEL}
				<Card --card-flex="0 1 auto" --card-gap="10px" --card-title-size="28px" title="Возможности">
					<Snackbar>
						<span>Остановить колесо, добавив ваш вариант</span>
						{#if $stopSpinAction.isEnabled}
							<span>{$stopSpinAction.price} Руб</span>
						{:else}
							<span>Х</span>
						{/if}
					</Snackbar>
					<Snackbar>
						<span>Продлить кручение колеса</span>
						{#if $continueSpinAction.isEnabled}
							<TransitionContainer trigger={$currentSpinPrice}>
								<span>{$currentSpinPrice} Руб</span>
							</TransitionContainer>
						{:else}
							<span>Х</span>
						{/if}
					</Snackbar>
				</Card>
			{/if}
			<Card
				--card-flex="1 1 0"
				--card-title-size="28px"
				title={activeRoute?.url === NAVIGATION_ROUTES.WHEEL ? 'Топ 10' : 'Правила'}
			>
				{#if activeRoute?.url === NAVIGATION_ROUTES.WHEEL}
					<div style="width: 100%;">
						{#each topLots as { id, title, color, contrastColor, value } (id)}
							{@const percent = (value / total) * 100}
							<div class="lot-preview-wrapper" animate:flip={{ duration: 200 }}>
								<LotPreview {id} {title} {color} {contrastColor} {percent} />
							</div>
						{/each}
					</div>
				{:else}
					<Textarea
						id="rules"
						placeholder="Написать правила..."
						isEditable={isTextRulesEditable}
						shouldFocus={isTextRulesEditable}
						bind:value={$textRules}
					/>
				{/if}
			</Card>
		</div>
	</div>
	<div class="layout-section layout-section_center">
		<Card --card-flex="1" --card-justify="end" --card-p="30px 20px">
			{#key previousRoute}
				<div class="layout-section-wrapper">
					<!-- in:fly={{ x: getFlyDirection()?.forward, duration: 300 }}
					out:fly={{ x: getFlyDirection()?.backward, duration: 300 }} -->
					<slot />
				</div>
			{/key}
			<div class="navigation-wrapper">
				{#if activeRoute?.url === NAVIGATION_ROUTES.LOTS}
					<div
						style="position: absolute; left: 26px; display: flex; align-items: center;"
						transition:fade={{ duration: 200 }}
					>
						<p>Общая сумма: &ThinSpace;</p>
						{#if isTotalShown}
							<p transition:slide={{ duration: 200, axis: 'x' }} aria-hidden>
								{getTotal($lots.map((l) => l.value))}
							</p>
						{/if}
						<Button icon="visibility" on:click={() => (isTotalShown = !isTotalShown)} />
					</div>
					<div
						style="position: absolute; right: 26px; display: flex; align-items: center;"
						transition:fade={{ duration: 200 }}
					>
						<p>Всего лотов: {$lots.length}</p>
						<Button icon="trashcan" on:click={() => lots.removeAll()} />
					</div>
				{/if}
				<Navigation bind:activeRoute on:routeswitch={(e) => (previousRoute = e.detail.from)} />
			</div>
		</Card>
	</div>
	<div class="layout-section layout-section_right">
		<div class="layout-wrapper">
			<Card --card-w="100%">
				<Timer />
			</Card>
			<Card --card-w="100%" --card-flex="0 1 auto" title="Интеграции">
				<!-- <TestKit /> -->
				<div class="integrations-wrapper">
					<Integration
						name="Donation Alerts"
						onSwitchOn={daSwitchOn}
						onSwitchOff={() => donationAlertsWebSocket.close()}
						authCallback={() => goto('/api/da/auth')}
						isDisabled={isConnectingToDonationAlerts}
						isAuthorized={!!daSession}
					/>
					<Integration
						name="Twitch"
						onSwitchOn={twitchSwitchOn}
						onSwitchOff={() => twitchWebSocket.close()}
						bind:isToggled={isTwitchToggled}
						isDisabled={isConnectingToTwitch}
						isAuthorized={!!twitchSession}
						authCallback={() => goto('/api/twitch/auth')}
					/>
				</div>
			</Card>
			<Card --card-flex="1 1 0" --card-flow="hidden auto" title="Очередь ({$donations.length})">
				<div class="donations-wrapper">
					{#each $donations as { created_at, ...donation } (donation.id)}
						<div class="donation-wrapper" animate:flip={{ duration: 300 }}>
							<Donation {...donation} />
						</div>
					{/each}
				</div>
			</Card>
		</div>
	</div>
</div>

<style lang="scss">
	.layout {
		position: relative;
		display: flex;
		width: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;

		&-wrapper {
			display: flex;
			flex-direction: column;
			gap: 20px;
			padding: 20px;
			height: 100%;
		}
		&-section-wrapper {
			position: absolute;
			top: 0;
			z-index: 1;
			display: flex;
			flex: 1 1 0;
			justify-content: center;
			padding-top: 30px;
			width: 100%;
			height: calc(100% - 170px);
			overflow: hidden;
		}
		&-section {
			position: relative;
			display: flex;
			flex-direction: column;
			color: var(--on-surface);
			overflow: hidden;

			&_left {
				flex: 1 1 25%;
				gap: 20px;
			}
			&_center {
				flex: 1 1 50%;
			}
			&_right {
				flex: 1 1 25%;
				overflow: inherit;
			}
		}
	}
	.donations {
		&-wrapper {
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: center;
			gap: 15px;
		}
	}
	.navigation-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		width: 100%;
	}

	.integrations-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		width: 100%;
	}

	.lot-preview-wrapper {
		display: flex;
		flex-direction: column;

		&:not(:last-child)::after {
			content: '';
			width: 100%;
			height: 1px;
			background-color: var(--outline-variant);
		}
	}
</style>
