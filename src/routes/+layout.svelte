<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { page } from '$app/stores';
	import { NAVIGATION_ROUTES, SOCKET_STATE } from '$lib/constants';
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Donation from '$lib/components/Donation.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import Rules from '$lib/components/Rules.svelte';
	import IntensityTracker from '$lib/components/IntensityTracker.svelte';
	import telegramIcon from '$lib/assets/telegram-logo/telegram-icon.svg';
	import githubIconWhite from '$lib/assets/github-mark/github-mark-white.svg';
	import boostyIcon from '$lib/assets/boosty_logo/White.svg';
	import Contact from '$lib/components/Contact.svelte';
	import settings from '$lib/stores/settings';
	import actionManager from '$lib/stores/actionManager';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import ViewerActions from '$lib/components/ViewerActions.svelte';
	import centrifugo from '$lib/stores/centrifugo';
	import VirtualList from '$lib/components/VirtualList.svelte';
	import TestKit from '$lib/components/TestKit.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { dev } from '$app/environment';
	import Icon from '$lib/components/Icon.svelte';
	import Lot from '$lib/components/Lot.svelte';
	import intensityTracker from '$lib/stores/intensityTracker';
	import Popup from '$lib/components/Popup.svelte';
	import Changelog from '$lib/components/Changelog.svelte';

	let isAuthorizedToDonationAlerts = $page.data.isAuthorizedToDonationAlerts;
	let isBackgroundVideoPaused = false;
	let isCentrifugoToggleDisabled = false;

	$: centrifugoState = centrifugo.state;
	$: transparency = settings.transparency;
	$: intensity = settings.intensity;
	$: currentIntensityLevel = intensityTracker.currentLevel;
	$: background = settings.background;
	$: autoScroll = settings.autoScroll;
	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
	$: {
		if ($centrifugoState !== SOCKET_STATE.OPEN) {
			isCentrifugoToggleDisabled = false;
		}
	}

	$: console.log('layout haveSeenUpdates: ', $page.data.haveSeenUpdates);
	onMount(() => {
		actionManager.initialize();
		lots.loadDatabaseItems();
	});
</script>

<Popup
	isOpened={!$page.data.haveSeenUpdates}
	onClose={() => fetch('/api/seen-updates', { method: 'POST' })}
>
	<Changelog />
</Popup>

<div
	class="layout"
	style="background-image: url({$background.type === 'image'
		? $background.url
		: ''}); --bg-opacity: {$transparency};"
>
	{#if $background.type === 'video'}
		<video
			src={$background.url}
			style="position: absolute; top: 0; left: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover;"
			preload="auto"
			autoplay
			muted
			loop
			bind:paused={isBackgroundVideoPaused}
		>
			<track kind="captions" />
		</video>
	{/if}

	{#if $intensity.isEnabled}
		<div style="position: fixed; z-index: 0; width: 100%;">
			<IntensityTracker level={$currentIntensityLevel} />
		</div>
	{/if}

	<div class="layout-section layout-section_left">
		<div class="layout-wrapper">
			{#if $page.route.id === NAVIGATION_ROUTES.WHEEL}
				<ViewerActions />
				<div class="list-wrapper">
					<div class="list-headers">
						<h4 style="min-width: 60px; margin-right: 10px; text-align: center;">ID</h4>
						<h4 style="width: 100%; padding: 0 10.5px;">Название</h4>
						<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Процент</h4>
					</div>
					<VirtualList
						lots={sortedLots}
						isAutoScrollEnabled={$autoScroll.isWheelListEnabled}
						autoScrollSpeed={$autoScroll.speed}
						let:item
					>
						{@const { contrastColor, donators, url, position, ...rest } = item}

						<Lot {...rest} isCompact={true} />
					</VirtualList>
				</div>
			{:else}
				<Rules />
			{/if}
			<div class="contacts-wrapper">
				<Contact icon={githubIconWhite} title="GitHub" url="https://github.com/Esouqu" />
				<Contact icon={telegramIcon} title="Telegram" url="https://t.me/esouqu" />
				<Contact icon={boostyIcon} title="Boosty" url="https://boosty.to/esouqu/donate" />
			</div>
		</div>
	</div>
	<div class="layout-section layout-section_center">
		<div class="layout-section-wrapper">
			<div class="navigation-wrapper">
				<Navigation />
			</div>
			<slot />
		</div>
	</div>
	<div class="layout-section layout-section_right">
		<div class="layout-wrapper">
			{#if dev}
				<TestKit />
			{/if}
			<Timer />
			<div style="height: 100%; scrollbar-gutter: stable; overflow: hidden auto;">
				<div class="donations-wrapper">
					{#each $donations as { created_at, ...donation } (donation.id)}
						<div style="width: 100%;" animate:flip={{ duration: 300 }}>
							<Donation {...donation} />
						</div>
					{/each}
				</div>
			</div>
			{#if isAuthorizedToDonationAlerts}
				<div class="indicator-wrapper">
					<Icon src={daIcon} />
					<Switch
						on={() => {
							isCentrifugoToggleDisabled = true;
							centrifugo.connect();
						}}
						off={() => centrifugo.disconnect()}
						isToggled={$centrifugoState === SOCKET_STATE.OPEN}
						isDisabled={$centrifugoState === SOCKET_STATE.CONNECTING || isCentrifugoToggleDisabled}
						isManualToggle={true}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.list-headers {
		display: flex;
		padding: 0 6px 0 0;
		border-radius: 10px 10px 0 0;
		background-color: var(--primary-50);

		& h4 {
			margin: 10px 0;
			letter-spacing: 0.5px;
		}
	}
	.navigation-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		padding: 20px;
		height: fit-content;
	}
	.layout {
		position: relative;
		display: flex;
		width: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			opacity: var(--bg-opacity, 1);
			background-color: var(--surface);
		}

		&-wrapper {
			display: flex;
			flex-direction: column;
			gap: 20px;
			height: 100%;
		}

		&-section-wrapper {
			display: flex;
			flex-direction: column;
			flex: 1 1 0;
			justify-content: center;
			width: 100%;
			height: calc(100% - 83px);
		}

		&-section {
			position: relative;
			z-index: 2;
			display: flex;
			flex-direction: column;
			padding: 20px;
			color: var(--on-surface);
			overflow: hidden;

			&_left {
				flex: 1 1 25%;
			}
			&_center {
				flex: 1 1 45%;
				padding: 0;
			}
			&_right {
				flex: 1 1 25%;
			}
		}
	}

	.contacts-wrapper {
		display: flex;
		width: 100%;
		justify-content: center;
		gap: 12px;
	}
	.donations-wrapper {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 15px;
		padding: 0 30px;
	}
	.indicator-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 20px;
		gap: 10px;
	}
	.list-wrapper {
		display: flex;
		flex-direction: column;
		border-bottom: 3px solid var(--primary-50);
		height: 100%;
		overflow: hidden;
	}
</style>
