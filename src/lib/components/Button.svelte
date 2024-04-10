<script lang="ts">
	import type { iconTypes } from '$lib/icons';
	import getIcon from '$lib/icons';

	export let icon: iconTypes;
	export let iconColor: 'white' | 'black' = 'white';
	export let title: string = '';
	export let color: string = 'var(--inverse-surface)';
	export let size: number = 30;
	export let isDisabled = false;
	export let isFilled = false;
	export let isInteractive = true;
</script>

<div style="display: contents; --button-color: {color};">
	<button
		style="--btn-hover-color: {iconColor === 'white' ? 'var(--hover-white)' : 'var(--hover-black)'}"
		type="button"
		class="button"
		class:filled={isFilled}
		class:interactive={isInteractive}
		{title}
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
		background-color: transparent;
		opacity: 1;
		transition: 0.2s;
		user-select: none;
		cursor: pointer;

		&:not(.interactive) {
			cursor: default;

			&:active {
				opacity: 1 !important;
			}
		}
		&.filled {
			background-color: var(--button-color);
		}

		&:hover:not(.filled) {
			background-color: var(--btn-hover-color);
		}
		&:active:not(.filled) {
			opacity: 0.7;
		}
		&:disabled {
			opacity: 0.3;
			pointer-events: none;
		}
	}
</style>
