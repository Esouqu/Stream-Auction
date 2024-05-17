<script lang="ts">
	import type { iconTypes } from '$lib/icons';
	import getIcon from '$lib/icons';

	export let icon: iconTypes;
	export let iconColor: 'white' | 'black' = 'white';
	export let text = '';
	export let color: string = 'var(--inverse-surface)';
	export let size: number = 30;
	export let isDisabled = false;
	export let isFilled = false;
	export let isInteractive = true;

	$: hoverColor = iconColor === 'white' ? 'var(--hover-white)' : 'var(--hover-black)';
	$: textColor = iconColor === 'white' ? 'var(--on-surface)' : 'var(--on-inverse-surface)';
</script>

<div style="display: contents; --button-color: {color};">
	<button
		style="--btn-hover-color: {hoverColor};"
		type="button"
		class="button"
		class:filled={isFilled}
		class:interactive={isInteractive}
		disabled={isDisabled}
		on:click|stopPropagation
		on:mouseenter
		on:mouseleave
		on:focus
	>
		{#if icon}
			<div class="icon-wrapper" style="width: {size}px; height: {size}px;">
				<img src={getIcon(icon, iconColor)} alt="Icon button" draggable="false" />
			</div>
		{/if}
		{#if text}
			<div
				style="margin-left: 5px; font-size: 15px; font-weight: 700; line-height: 1; color: {textColor};"
			>
				{text}
			</div>
		{/if}
	</button>
</div>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--button-p, 5px);
		border: none;
		border-radius: 10px;
		opacity: 1;
		background-color: transparent;
		transition: 0.1s;
		user-select: none;
		cursor: pointer;

		&:not(.interactive) {
			cursor: default;

			&:active {
				opacity: 1 !important;
			}
		}
		&.filled {
			box-shadow: var(--elevation-1);
			background-color: var(--button-color);
		}

		&:hover:not(.filled) {
			background-color: var(--btn-hover-color);
		}
		&:active:not(.filled) {
			opacity: 0.7;
		}
		&.interactive {
			&:active {
				opacity: 0.8;
				// box-shadow: inset 0 2px 2px black;

				// & img {
				// 	scale: 0.9;
				// 	transition: 0.1s;
				// }
			}
		}
		&:disabled {
			opacity: 0.3;
			pointer-events: none;
		}
	}
</style>
