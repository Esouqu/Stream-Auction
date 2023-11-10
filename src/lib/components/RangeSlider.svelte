<script lang="ts">
	export let value: number;
	export let min: number = 1;
	export let max: number = 10;
	export let step: number = 1;
</script>

<div class="range-slider-wrapper">
	<input id="level-range" class="range-slider" type="range" {min} {max} {step} bind:value />
</div>

<style lang="scss">
	.range-slider {
		appearance: none;
		width: 100%;
		height: 25px;
		border: 0;
		outline: 0;
		background: gray;
		transition: box-shadow 0.2s ease-in-out;
		user-select: none;

		&-wrapper {
			display: flex;
			border-radius: 50px;
			rotate: -90deg;
			overflow: hidden;
		}

		&::-webkit-slider-thumb {
			appearance: none;
			width: 50px;
			height: 25px;
			padding: 10px;
			border-radius: 50px;
			box-shadow: -400px 0 0 360px var(--color-orange), inset 0 0 0 5px var(--color-orange);
			background-color: white;
			background-size: contain;
			transition: box-shadow 0.2s ease-in-out;
			user-select: none;
			cursor: pointer;
		}
	}
</style>
