<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { page } from '$app/stores';
	import { NAVIGATION_ROUTES, SOCKET_STATE } from '$lib/constants';
	import { getTotal } from '$lib/utils';
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Donation from '$lib/components/Donation.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import LotPreview from '$lib/components/LotPreview.svelte';
	import Rules from '$lib/components/Rules.svelte';
	import IntensityTracker from '$lib/components/IntensityTracker.svelte';
	import discordIconWhite from '$lib/assets/discord-logo/icon_clyde_white_RGB.svg';
	import githubIconWhite from '$lib/assets/github-mark/github-mark-white.svg';
	import boostyIcon from '$lib/assets/boosty_logo/White.svg';
	import Contact from '$lib/components/Contact.svelte';
	import settings from '$lib/stores/settings';
	import actionManager from '$lib/stores/actionManager';
	import TitledSection from '$lib/components/TitledSection.svelte';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import ViewerActions from '$lib/components/ViewerActions.svelte';
	import Indicator from '$lib/components/Indicator.svelte';
	import centrifugo from '$lib/stores/centrifugo';
	import VirtualList from '$lib/components/VirtualList.svelte';
	import TestKit from '$lib/components/TestKit.svelte';
	import ActionPanel from '$lib/components/ActionPanel.svelte';
	import Switch from '$lib/components/Switch.svelte';

	let isAuthorizedToDonationAlerts = $page.data.isAuthorizedToDonationAlerts;
	let isBackgroundVideoPaused = false;
	let isCentrigugoToggleDisabled = false;

	$: centrifugoState = centrifugo.state;
	$: transparency = settings.transparency;
	$: intensity = settings.intensity;
	$: background = settings.background;
	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
	$: total = getTotal($lots.map((l) => l.value));
	$: {
		if ($centrifugoState !== SOCKET_STATE.OPEN) {
			isCentrigugoToggleDisabled = false;
		}
	}

	onMount(() => {
		actionManager.initialize();
		lots.loadDatabaseItems();
	});
</script>

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
		<div style="position: fixed; z-index: 0; width: 100%; opacity: 0.7;">
			<IntensityTracker
				minIntensityValue={$intensity.price}
				isDonationsOn={$centrifugoState === SOCKET_STATE.OPEN}
			/>
		</div>
	{/if}

	<div class="layout-section layout-section_left">
		<div class="layout-wrapper">
			{#if $page.route.id === NAVIGATION_ROUTES.WHEEL}
				<ViewerActions />
				<TitledSection
					--titled-section-overflow="hidden"
					--titled-section-height="100%"
					--titled-section-justify="center"
					--titled-section-gap="0px"
					title="Варианты"
				>
					<div class="list-headers">
						<h4 style="min-width: 60px; margin-right: 10px; text-align: center;">ID</h4>
						<h4 style="width: 100%; padding: 0 10.5px;">Название</h4>
						<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Процент</h4>
					</div>
					<VirtualList lots={sortedLots} let:item>
						{@const { id, title, color } = item}
						{@const percent = (item.value / total) * 100}

						<LotPreview {id} {title} {color} {percent} />
					</VirtualList>
				</TitledSection>
			{:else}
				<Rules />
			{/if}
			<div style="display: flex; width: 100%; justify-content: center; gap: 10px;">
				<Contact icon={boostyIcon} title="Поддержать" url="https://boosty.to/esouqu/donate" />
				<Contact title="Esouqu" icon={githubIconWhite} url="https://github.com/Esouqu" />
				<Contact title="nikogda" icon={discordIconWhite} />
			</div>
		</div>
	</div>
	<div class="layout-section layout-section_center">
		<div class="layout-section-wrapper">
			<ActionPanel />
			<slot />
		</div>
	</div>
	<div class="layout-section layout-section_right">
		<div class="layout-wrapper">
			<Timer />
			<TestKit />
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
					<div class="icon-wrapper" style="padding: 10px;">
						<img src={daIcon} alt="DonationAlerts icon" />
					</div>
					<!-- <div class="default-title" style="margin-right: 10px;">DonationAlerts</div> -->
					<!-- <Indicator isActive={$centrifugoState === SOCKET_STATE.OPEN} /> -->
					<Switch
						on={() => {
							isCentrigugoToggleDisabled = true;
							centrifugo.connect();
						}}
						off={() => centrifugo.disconnect()}
						isToggled={$centrifugoState === SOCKET_STATE.OPEN}
						isDisabled={$centrifugoState === SOCKET_STATE.CONNECTING || isCentrigugoToggleDisabled}
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
			// border-radius: 10px 10px 0 0;
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
	}
</style>
