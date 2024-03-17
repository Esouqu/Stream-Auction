<script lang="ts">
	import { TIMER_STATE, WHEEL_STATE } from '$lib/constants';
	import { formatTime } from '$lib/utils';
	import timer from '$lib/stores/timer';
	import wheel from '$lib/stores/wheel';
	import Button from './Button.svelte';
	import actionManager from '$lib/stores/actionManager';

	export let timeToAdd: number = 60000;

	$: time = timer.time;
	$: wheelState = wheel.state;
	$: timerState = timer.state;
	$: currentTime = formatTime($time);
</script>

<div class="timer">
	<p class="timer__time" class:delayed={$wheelState === WHEEL_STATE.DELAYED}>
		{currentTime.min}:{currentTime.sec}:{currentTime.ms}
	</p>
	<div class="timer-buttons-wrapper">
		{#if $wheelState === WHEEL_STATE.SPINNING}
			<h3>Происходит кручение колеса...</h3>
		{:else if $wheelState === WHEEL_STATE.DELAYED}
			<h3>Задержка...</h3>
		{:else}
			{#if $timerState !== TIMER_STATE.RUNNING}
				<Button
					--button-size="60px"
					--button-p="10px"
					icon="start"
					on:click={() => actionManager.startAuction()}
				/>
			{:else if $timerState === TIMER_STATE.RUNNING}
				<Button
					--button-size="60px"
					--button-p="10px"
					icon="pause"
					on:click={() => actionManager.pauseAuction()}
				/>
			{/if}
			<Button --button-size="60px" --button-p="10px" icon="reset" on:click={() => timer.reset()} />
			<Button
				--button-size="60px"
				--button-p="10px"
				icon="upArrow"
				on:click={() => timer.add(timeToAdd)}
			/>
			<Button
				--button-size="60px"
				--button-p="10px"
				icon="downArrow"
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
			width: 100%;
		}

		&__time {
			margin: 0;
			font-size: 80px;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
			user-select: none;

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
