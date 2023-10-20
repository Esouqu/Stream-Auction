<script lang="ts">
	type colorTypes = 'purple' | 'orange' | 'red' | 'gradient' | 'default';
	type shapeTypes = 'default' | 'circle';

	export let text: string;
	export let color: colorTypes = 'default';
	export let shape: shapeTypes = 'default';
	export let isDisabled = false;
</script>

<button
	type="button"
	class="button"
	class:button_purple={color === 'purple'}
	class:button_orange={color === 'orange'}
	class:button_red={color === 'red'}
	class:button_gradient={color === 'gradient'}
	class:button_circle={shape === 'circle'}
	disabled={isDisabled}
	on:click
>
	{text}
</button>

<style lang="scss">
	.button {
		translate: 0 0;
		padding: 10px;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 2px 2px black;
		font-weight: 700;
		text-transform: uppercase;
		color: black;
		background-color: buttonface;
		transition: 0.2s;
		user-select: none;

		&_purple {
			color: white;
			background-color: var(--color-purple);
		}
		&_orange {
			color: white;
			background-color: var(--color-orange);
		}
		&_red {
			color: white;
			background-color: crimson;
		}
		&_gradient {
			color: white;
			background-image: linear-gradient(90deg, var(--color-orange) 0%, var(--color-purple) 100%);
		}

		&_circle {
			font-size: 20px;
			width: 100px;
			height: 100px;
			border-radius: 50% !important;
		}

		&:disabled {
			translate: 0% 3%;
			box-shadow: 0 1px 0px black;
			opacity: 0.8;
			background-color: dimgray;
			pointer-events: none;
		}
		&:hover {
			translate: 0% -3%;
			box-shadow: 0 2px 5px black;
			cursor: pointer;
		}
		&:active {
			translate: 0% 3%;
			box-shadow: 0 1px 0px black;
		}
	}
</style>
