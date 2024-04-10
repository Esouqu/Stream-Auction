<script lang="ts">
	export let value: number;
	export let min: number = 1;
	export let max: number = 10;
	export let step: number = 1;
	export let isDisabled = false;
</script>

<div class="range-slider-wrapper">
	<input
		id="level-range"
		class="range-slider"
		type="range"
		{min}
		{max}
		{step}
		bind:value
		disabled={isDisabled}
	/>
</div>

<style lang="scss">
	.range-slider {
		appearance: none;
		width: var(--slider-width, 200px);
		height: 25px;
		border: 0;
		border-radius: 50px;
		outline: 0;
		background: gray;
		transition: box-shadow 0.2s ease-in-out;
		user-select: none;

		&:disabled {
			opacity: 0.5;

			&::-webkit-slider-thumb {
				cursor: default;
			}
		}

		&-wrapper {
			display: flex;
			border-radius: 50px;
			width: var(--slider-width, 200px);
			overflow: hidden;
		}

		&::-webkit-slider-thumb {
			appearance: none;
			width: 50px;
			height: 25px;
			padding: 10px;
			border-radius: 50px;
			box-shadow: -400px 0 0 360px var(--primary-50), inset 0 0 0 7px var(--primary-50);
			background-color: var(--on-surface);
			background-size: contain;
			transition: box-shadow 0.2s ease-in-out;
			user-select: none;
			cursor: pointer;
		}
	}
</style>
