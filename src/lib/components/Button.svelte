<script lang="ts">
	import tooltip from '$lib/actions/tooltip';
	import type { Props } from 'tippy.js';
	import Icon from './Icon.svelte';

	export let color: 'default' | 'transparent' | 'error' | 'active' = 'default';
	export let icon = '';
	export let iconSize = '30px';
	export let text = '';
	export let tooltipProps: Partial<Props> = {};
	export let isDisabled = false;
	export let isInteractive = true;
	export let hoverColor: 'white' | 'black' = 'white';
</script>

<button
	style="--btn-hover-color: var(--hover-{hoverColor}); --btn-text-color: {hoverColor};"
	type="button"
	class="button {color}"
	class:interactive={isInteractive}
	disabled={isDisabled}
	use:tooltip={{
		...tooltipProps,
		onShow: (instance) => {
			if (!tooltipProps.content) return false;

			if (tooltipProps.onShow) tooltipProps.onShow(instance);
		}
	}}
	on:click|stopPropagation
	on:mouseenter
	on:mouseleave
	on:focus
>
	{#if icon}
		<Icon src={icon} {iconSize} />
	{/if}
	{#if text}
		<span class="button-text" title={text}>{text}</span>
	{/if}
</button>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--button-p, 5px);
		border: none;
		border-radius: var(--button-border-radius, 10px);
		width: var(--button-w, auto);
		opacity: 1;
		font-size: 15px;
		font-weight: 700;
		line-height: 1;
		transition: 0.1s;
		user-select: none;
		overflow: var(--button-overflow, unset);
		cursor: pointer;

		&-text {
			padding: 0 6px;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		&.default {
			background-color: var(--inverse-surface);
		}

		&.red {
			background-color: var(--error);
		}

		&.active {
			background-color: var(--primary-50);
		}

		&.transparent {
			color: var(--btn-text-color);
			background-color: transparent;

			&:hover {
				background-color: var(--btn-hover-color);
			}
		}

		&:not(.transparent) {
			box-shadow: var(--elevation-1);
		}

		&:not(.interactive) {
			cursor: default;

			&:active {
				opacity: 1 !important;
			}
		}

		&:active:not(.transparent) {
			opacity: 0.7;
		}

		&:disabled {
			opacity: 0.3;
			pointer-events: none;
		}
	}
</style>
