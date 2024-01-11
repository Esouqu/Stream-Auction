<script lang="ts">
	import { WHEEL_STATE } from '$lib/constants';
	import { formatTime } from '$lib/utils';
	import timer from '$lib/stores/timer';
	import wheel from '$lib/stores/wheel';
	import Button from './Button.svelte';

	export let timeToAdd: number = 60000;

	$: currentTime = formatTime($timer.timeRemaining);
	$: wheelState = wheel.state;
</script>

<div class="timer">
	<p class="timer__time">{currentTime.min}:{currentTime.sec}:{currentTime.ms}</p>
	<div class="timer-buttons-wrapper">
		{#if $wheelState === WHEEL_STATE.SPINNING}
			<h3>Происходит кручение колеса...</h3>
		{:else}
			{#if !$timer.isRunning}
				<Button
					--button-size="60px"
					--button-p="10px"
					icon="start"
					on:click={() => timer.start()}
				/>
			{:else}
				<Button
					--button-size="60px"
					--button-p="10px"
					icon="pause"
					on:click={() => timer.pause()}
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
		}
	}
</style>
