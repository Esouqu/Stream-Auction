<script lang="ts">
	import { TIMER_STATE, WHEEL_STATE } from '$lib/constants';
	import timer from '$lib/stores/timer';
	import wheel from '$lib/stores/wheel';
	import Button from './Button.svelte';
	import actionManager from '$lib/stores/actionManager';
	import settings from '$lib/stores/settings';

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
	<p
		class="timer__time"
		class:up={$timerState === TIMER_STATE.INCREASING}
		class:down={$timerState === TIMER_STATE.DECREASING}
		class:delayed={$wheelState === WHEEL_STATE.DELAYED}
	>
		{$formattedTime.min}:{$formattedTime.sec}:{$formattedTime.ms}
	</p>
	<div class="timer-buttons-wrapper">
		{#if $wheelState === WHEEL_STATE.SPINNING}
			<h3>Происходит кручение колеса...</h3>
		{:else if $wheelState === WHEEL_STATE.DELAYED}
			<h3>Задержка...</h3>
		{:else}
			{#if $timerState !== TIMER_STATE.RUNNING}
				<Button icon="start" size={40} on:click={() => actionManager.startAuction()} />
			{:else if $timerState === TIMER_STATE.RUNNING}
				<Button icon="pause" size={40} on:click={() => actionManager.pauseAuction()} />
			{/if}
			<Button icon="reset" size={40} on:click={() => timer.reset()} />
			<Button icon="upArrow" size={40} on:click={() => timer.add(timeToAdd)} />
			<Button icon="downArrow" size={40} on:click={() => timer.subtract(timeToAdd)} />
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

			&.delayed {
				animation: blink 0.5s infinite alternate ease-in;
			}

			&.up {
				color: var(--primary-50);
			}

			&.down {
				color: var(--error);
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
