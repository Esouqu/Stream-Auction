<script lang="ts">
	type colorTypes = 'purple' | 'orange' | 'red' | 'default';
	type shapeTypes = 'default' | 'circle';

	export let text: string;
	export let color: colorTypes = 'default';
	export let shape: shapeTypes = 'default';
	export let icon: string = '';
	export let isDisabled = false;
</script>

<button
	type="button"
	class="button"
	class:button_purple={color === 'purple'}
	class:button_orange={color === 'orange'}
	class:button_red={color === 'red'}
	class:button_circle={shape === 'circle'}
	disabled={isDisabled}
	on:click
>
	{#if icon}
		<div class="button-icon-wrapper">
			<img src={icon} alt="Button icon" />
		</div>
	{/if}
	<span>{text}</span>
</button>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		translate: 0 0;
		padding: 10px;
		border: 0;
		border-radius: 10px;
		box-shadow: 0 2px 2px black;
		line-height: 1;
		font-size: 16px;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--on-inverse-surface);
		background-color: var(--inverse-surface);
		transition: 0.2s;
		user-select: none;

		&-icon-wrapper {
			height: 30px;

			& img {
				height: 100%;
			}
		}

		&_purple {
			color: var(--on-surface);
			background-color: var(--primary-50);
		}
		&_orange {
			color: var(--inverse-on-surface);
			background-color: var(--color-orange);
		}
		&_red {
			color: var(--on-surface);
			background-color: var(--error);
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
			background-color: var(--neutral);
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
