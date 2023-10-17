<script lang="ts">
	import type { ILot } from '$lib/interfaces';
	import lots from '$lib/stores/lots';
	import timer from '$lib/stores/timer';
	import { addTimeOnNewItem, addTimeOnNewLeader } from '$lib/stores/settings';
	import { formatTime } from '$lib/utils';
	import Button from './Button.svelte';

	export let timeToAdd: number = 60000;

	$: currentTime = formatTime($timer.timeRemaining);
	$: addTime($lots);

	function addTime(_: ILot[]) {
		if (!$timer.isRunning) return;

		const newItemTime = $addTimeOnNewItem.value;
		const newLeaderTime = $addTimeOnNewLeader.value;

		if ($addTimeOnNewItem.isToggled) {
			lots.onNewItem(() => {
				timer.add(Number(newItemTime) * 1000);
			});
		}

		if ($addTimeOnNewLeader.isToggled) {
			lots.onNewLeader(() => {
				timer.add(Number(newLeaderTime) * 1000);
			});
		}
	}
</script>

<div class="timer">
	<p class="timer__time">{currentTime.min}:{currentTime.sec}:{currentTime.ms}</p>
	<div class="timer-buttons-wrapper">
		{#if !$timer.isRunning}
			<Button --button-size="60px" --button-p="10px" icon="start" on:click={() => timer.start()} />
		{:else}
			<Button --button-size="60px" --button-p="10px" icon="pause" on:click={() => timer.pause()} />
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
	</div>
</div>

<style lang="scss">
	.timer {
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
			font-size: 72px;
			letter-spacing: 5px;
			font-variant-numeric: tabular-nums;
			font-weight: 200;
		}
	}
</style>
