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
	import lots from '$lib/stores/lots';
	import { compareStrings, isUrl } from '$lib/utils';
	import wheel, { WHEEL_STATE } from '$lib/stores/wheel';
	import timer from '$lib/stores/timer';
	import Event from '$lib/components/Event.svelte';
	import events from '$lib/stores/events';
	import { onMount } from 'svelte';
	import Integration from '$lib/components/Integration.svelte';
	import backgroundImage from '$lib/stores/backgroundImage';

	const customRewardTitle = 'Stream Auction - Бесплатный Заказ';
	const donationStopWord = '#bomb';

	let activeRoute: IRoute;
	let daSession: string = $page.data.daSession;
	let twitchSession: string = $page.data.twitchSession;
	let isConnectingToDonationAlerts = false;
	let isConnectingToTwitch = false;
	let isTwitchToggled = false;
	let donationAlertsWebSocket: WebSocket;
	let twitchWebSocket: WebSocket;

	$: $lots, addCountdownTime();
	$: wheelState = wheel.state;

	onMount(() => {
		const bgImage = localStorage.getItem('bgImage');
		const validationInterval = 1000 * 60 * 60;
		let validationIntervalId: NodeJS.Timeout;

		if (bgImage) {
			backgroundImage.set(`url(${bgImage})`);
		}

		validationIntervalId = setInterval(async () => {
			await fetch('/api/twitch/validate');
		}, validationInterval);

		return () => clearInterval(validationIntervalId);
	});

	function addCountdownTime() {
		if (!$timer.isRunning) return;

		const newItemTime = $addTimeOnNewItem.value;
		const newLeaderTime = $addTimeOnNewLeader.value;

		if ($addTimeOnNewItem.isToggled && $wheelState !== WHEEL_STATE.SPINNING) {
			lots.onNewItem(() => {
				timer.add(Number(newItemTime) * 1000);
			});
		}
		if ($addTimeOnNewLeader.isToggled && $wheelState !== WHEEL_STATE.SPINNING) {
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

	function processIdDonation(lotId: RegExpMatchArray, donation: IDonationData) {
		const id = Number(lotId[0].replace('#', ''));
		const amount = donation.amount_in_user_currency;
		const isEnoughAmount = amount >= Number($stopSpin.value);
		let isAdded = false;

		for (const l of $lots) {
			if (l.id !== id) continue;

			lots.addValue(id, amount, donation.username);
			events.add(`+${amount}: ${l.title}`, donation.type);

			isAdded = true;
		}

		if (!isAdded) {
			donations.add(donation);
		}

		if ($stopSpin.isToggled && $wheelState === WHEEL_STATE.SPINNING && isEnoughAmount) {
			wheel.stop();
			timer.reset();
		}
	}

	function precessUrlDonation(donation: IDonationData) {
		const isEnoughAmount = donation.amount >= Number($stopSpin.value);

		if ($wheelState !== WHEEL_STATE.SPINNING) {
			donations.add({
				...donation,
				amount_in_user_currency: donation.amount
			});
		} else {
			lots.add(donation.message, donation.amount, donation.username);
			events.add(`${donation.message}`, donation.type, 'add');

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

		if ($wheelState === WHEEL_STATE.SPINNING && $additionSpinTime.isToggled) {
			addSpinTime(amount);
		}

		if (donation.message.toLowerCase().includes(donationStopWord)) {
			const replacedMessage = donation.message.toLowerCase().replace('#bomb', '');
			donations.add({ ...donation, message: replacedMessage });

			return;
		}

		if (lotId) {
			processIdDonation(lotId, { ...donation, amount_in_user_currency: amount });

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
				events.add(`+${amount}: ${l.title}`, donation.type);
				acceptableLots = [];

				if ($stopSpin.isToggled && $wheelState === WHEEL_STATE.SPINNING && isEnoughAmount) {
					wheel.stop();
					timer.reset();
				}

				return;
			}

			if (comparePercent > minMergeThreshold) {
				acceptableLots.push({
					...l,
					comparePercent
				});
			}
		}

		if ($stopSpin.isToggled && $wheelState === WHEEL_STATE.SPINNING && isEnoughAmount) {
			lots.add(donation.message, amount, donation.username);
			events.add(`${donation.message}`, donation.type, 'add');

			wheel.stop();
			timer.reset();

			return;
		}

		if (acceptableLots.length > 0) {
			mostSimilarLot = acceptableLots.reduce((prev, current) =>
				prev.comparePercent > current.comparePercent ? prev : current
			);
		}

		donations.add({ ...donation, mostSimilarLot });
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
			// console.log('Twitch WebSocket connection opened');
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
			// console.log(JSON.parse(event.data));
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
					const input = redeemedReward.redemption.user_input;
					const amount = redeemedReward.redemption.reward.cost;
					const createdAt = redeemedReward.redemption.redeemed_at;

					processDonation({
						id,
						type: 'Twitch',
						username,
						amount,
						amount_in_user_currency: amount,
						message: input,
						currency: '',
						created_at: createdAt.toString(),
						mostSimilarLot: null
					});
				}
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

				processDonation({
					...donation,
					type: 'Donation Alerts',
					username,
					amount_in_user_currency: roundedAmount
				});
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

<div class="layout" style="background-image: {$backgroundImage};">
	<div class="layout-section layout-section_left">
		<h1 style="font-size: 28px;">Правила Аукциона</h1>
		<h3 style="font-size: 20px; text-align: center;">
			Добавьте <b>#bomb</b> в сообщении доната, чтобы не добавлять его автоматически
		</h3>
		{#if $stopSpin.isToggled}
			<h3 style="font-size: 20px; text-align: center;">
				Остановить колесо <br />
				добавив ваш вариант <br />
				{$stopSpin.value}
				{$stopSpin.valueAttribute}
			</h3>
		{/if}
		{#if $additionSpinTime.isToggled}
			<h3 style="font-size: 20px; text-align: center;">
				Продлить прокрут колеса <br />
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
			<div class="integrations-wrapper">
				<Integration
					name="Donation Alerts"
					color="orange"
					icon={daIcon}
					onSwitchOn={daSwitchOn}
					onSwitchOff={() => donationAlertsWebSocket.close()}
					authCallback={() => goto('/api/da/auth')}
					isDisabled={isConnectingToDonationAlerts}
					isAuthorized={!!daSession}
				/>
				<Integration
					name="Twitch"
					color="purple"
					icon={twitchIcon}
					onSwitchOn={twitchSwitchOn}
					onSwitchOff={() => twitchWebSocket.close()}
					bind:isToggled={isTwitchToggled}
					isDisabled={isConnectingToTwitch}
					isAuthorized={!!twitchSession}
					authCallback={() => goto('/api/twitch/auth')}
				/>
			</div>
			<!-- <button
				type="button"
				on:click={() =>
					donations.add({
						id: 1,
						type: 'Twitch',
						username: 'Tester',
						message: 'Testing',
						amount: 300,
						amount_in_user_currency: 300,
						currency: 'RUB',
						mostSimilarLot: null,
						created_at: ''
					})}>DONATE</button
			> -->
			<div class="donations-scroll-wrapper">
				<div class="donations-wrapper" data-donations-queue={$donations.length}>
					{#each $donations as { id, type, username, message, amount, amount_in_user_currency, currency, mostSimilarLot }}
						<Donation
							{id}
							{type}
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
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;

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
			overflow: hidden;
		}
		&-section {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
			color: white;

			&_left {
				gap: 20px;
				& h3 {
					margin: 0;
				}
			}
			&_center {
				justify-content: space-between;
				padding: 30px 0;
				box-shadow: 0px 4px 15px black;
				background-color: rgb(20 20 20 / 70%);
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
		padding: 60px 0 0 0;
	}

	.integrations-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 20px;
		min-width: 350px;
		max-width: 350px;
		box-shadow: 0px 3px 8px black;
		background-color: rgb(20 20 20 / 70%);

		&::before {
			content: 'Интеграции';
			margin: 0;
			text-align: center;
			font-size: 18px;
			font-weight: 600;
		}
	}
</style>
