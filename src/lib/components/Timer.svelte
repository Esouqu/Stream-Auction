<script lang="ts">
	import { TIMER_STATE, WHEEL_STATE } from '$lib/constants';
	import timer from '$lib/stores/timer';
	import wheel from '$lib/stores/wheel';
	import Button from './Button.svelte';
	import actionManager from '$lib/stores/actionManager';
	import settings from '$lib/stores/settings';
	import startIcon from '$lib/assets/play_icon.svg';
	import pauseIcon from '$lib/assets/pause_icon.svg';
	import resetIcon from '$lib/assets/replay_icon.svg';
	import upArrowIcon from '$lib/assets/arrow_up_icon.svg';
	import downArrowIcon from '$lib/assets/arrow_down_icon.svg';

	export let timeToAdd: number = 60000;

	$: wheelState = wheel.state;
	$: timerState = timer.state;
	$: timerKeyConfig = settings.timerKeyConfig;
	$: formattedTime = timer.formattedTime;

	function handleKeydown(e: KeyboardEvent) {
		if (!$timerKeyConfig.isEnabled || $wheelState !== WHEEL_STATE.IDLE) return;

		if (e.code === $timerKeyConfig.add) timer.add(timeToAdd);
		if (e.code === $timerKeyConfig.subtract) timer.subtract(timeToAdd);
		if (e.code === $timerKeyConfig.reset) timer.reset();
		if (e.code === $timerKeyConfig.startOrPause) {
			if ($timerState === TIMER_STATE.RUNNING) timer.pause();
			else timer.start();
		}
	}
</script>

<svelte:document on:keydown={(e) => handleKeydown(e)} />

<div class="timer">
	<p class="timer__time" class:delayed={$wheelState === WHEEL_STATE.DELAYED}>
		{$formattedTime.min}:{$formattedTime.sec}:{$formattedTime.ms}
	</p>
	<div class="timer-buttons-wrapper">
		{#if $wheelState === WHEEL_STATE.SPINNING}
			<h3>Происходит кручение колеса...</h3>
		{:else if $wheelState === WHEEL_STATE.DELAYED}
			<h3>Задержка...</h3>
		{:else}
			{#if $timerState !== TIMER_STATE.RUNNING}
				<Button
					icon={startIcon}
					color="transparent"
					iconSize="40px"
					on:click={() => actionManager.startAuction()}
				/>
			{:else if $timerState === TIMER_STATE.RUNNING}
				<Button
					icon={pauseIcon}
					iconSize="40px"
					color="transparent"
					on:click={() => actionManager.pauseAuction()}
				/>
			{/if}
			<Button icon={resetIcon} color="transparent" iconSize="40px" on:click={() => timer.reset()} />
			<Button
				icon={upArrowIcon}
				color="transparent"
				iconSize="40px"
				on:click={() => timer.add(timeToAdd)}
			/>
			<Button
				icon={downArrowIcon}
				color="transparent"
				iconSize="40px"
				on:click={() => timer.subtract(timeToAdd)}
			/>
		{/if}
	</div>
</div>

<style lang="scss">
	.timer {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;

		&-buttons-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10px;
			width: 100%;
			height: 50px;
		}

		&__time {
			margin: 0;
			font-size: 80px;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			letter-spacing: 6px;
			transition: color 0.3s;
			user-select: none;

			@media (max-width: 1366px) {
				font-size: 60px;
			}

			&.delayed {
				animation: blink 0.5s infinite alternate ease-in;
			}
		}
	}

	@keyframes blink {
		0% {
			color: inherit;
		}
		100% {
			color: var(--error);
		}
	}
</style>
