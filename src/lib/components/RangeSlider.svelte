<script lang="ts">
	export let min = 1;
	export let max = 10;
	export let step = 1;
	export let from = 3;
	export let to = 7;
	export let isDisabled = false;
	export let isDoubleInput = false;

	const minGap = 1;

	$: fillValue1 = isDoubleInput ? (from / max) * 100 : 0;
	$: fillValue2 = (to / max) * 100;

	function capFirstValue() {
		if (to - from <= minGap) to = from + minGap;
	}
	function capSecondValue() {
		if (to - from <= minGap) from = to - minGap;
	}
</script>

<div class="range-slider-wrapper">
	<div
		class="range-slider-track"
		style="--track-fill-1: {fillValue1}%; --track-fill-2: {fillValue2}%;"
	/>
	{#if isDoubleInput}
		<input
			id="range-slider-1"
			class="range-slider"
			type="range"
			disabled={isDisabled}
			{min}
			{max}
			{step}
			bind:value={from}
			on:input={capFirstValue}
		/>
	{/if}
	<input
		id="range-slider-2"
		class="range-slider"
		type="range"
		disabled={isDisabled}
		{min}
		{max}
		{step}
		bind:value={to}
		on:input={capSecondValue}
	/>
</div>

<style lang="scss">
	.range-slider {
		appearance: none;
		position: absolute;
		top: 0;
		bottom: 0;
		border: 0;
		border-radius: 50px;
		outline: 0;
		width: var(--slider-width, 200px);
		background-color: transparent;
		pointer-events: none;
		user-select: none;

		&:disabled {
			opacity: 0.5;

			&::-webkit-slider-thumb {
				cursor: default;
			}
		}

		&-wrapper {
			position: relative;
			display: flex;
			border-radius: 50px;
			width: var(--slider-width, 200px);
		}

		&-track {
			width: 100%;
			height: 5px;
			border-radius: 5px;
			background-image: linear-gradient(
				to right,
				var(--outline) var(--track-fill-1),
				var(--primary-50) var(--track-fill-1),
				var(--primary-50) var(--track-fill-2),
				var(--outline) var(--track-fill-2)
			);
		}

		&::-moz-range-track {
			appearance: none;
			height: 5px;
		}
		&::-webkit-slider-runnable-track {
			appearance: none;
			height: 5px;
		}

		&::-moz-range-thumb {
			appearance: none;
			width: 18px;
			height: 18px;
			padding: 10px;
			margin-top: -7px;
			border-radius: 100%;
			background-color: var(--on-surface);
			transition: 0.1s;
			user-select: none;
			pointer-events: auto;
			cursor: pointer;

			&:active {
				position: relative;
				z-index: 999;
				background-color: var(--primary-50);
				outline: 3px solid var(--on-surface);
			}
		}
		&::-webkit-slider-thumb {
			appearance: none;
			width: 18px;
			height: 18px;
			padding: 10px;
			margin-top: -7px;
			border-radius: 100%;
			background-color: var(--on-surface);
			transition: 0.1s;
			user-select: none;
			pointer-events: auto;
			cursor: pointer;

			&:active {
				position: relative;
				z-index: 999;
				background-color: var(--primary-50);
				outline: 3px solid var(--on-surface);
			}
		}

		&::-moz-range-thumb {
			width: 0;
			height: 0;
		}
	}
</style>
