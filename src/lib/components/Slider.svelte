<script lang="ts">
	export let value: number;
	export let min: number = 1;
	export let max: number = 10;
	export let step: number = 1;
	export let isDisabled = false;
</script>

<div class="slider-wrapper">
	<input
		id="slider"
		class="slider"
		type="range"
		{min}
		{max}
		{step}
		bind:value
		disabled={isDisabled}
	/>
</div>

<style lang="scss">
	.slider {
		appearance: none;
		width: var(--slider-width, 200px);
		height: 5px;
		border: 0;
		border-radius: 50px;
		outline: 0;
		background: var(--outline);
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
			// overflow: hidden;
		}

		&::-webkit-slider-thumb {
			appearance: none;
			width: 18px;
			height: 18px;
			padding: 10px;
			border-radius: 50px;
			// box-shadow: -370px 0 0 360px var(--primary-50);
			background-color: var(--on-surface);
			background-size: contain;
			transition: box-shadow 0.2s ease-in-out;
			user-select: none;
			cursor: pointer;
		}
	}
</style>
