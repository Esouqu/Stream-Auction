<script lang="ts">
	import type { iconTypes } from '$lib/icons';
	import getIcon from '$lib/icons';

	export let icon: iconTypes;
	export let color: 'white' | 'black' = 'white';
	export let shadowColor: string | null = null;
</script>

<button
	type="button"
	class="icon-button"
	class:icon-button_black={color === 'black'}
	on:click|stopPropagation
>
	<img
		style="--icon-sc: {shadowColor}"
		class:shadowed={!!shadowColor}
		src={getIcon(icon, color)}
		alt="Icon button"
		draggable="false"
	/>
</button>

<style lang="scss">
	.icon-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--button-size, 40px);
		height: var(--button-size, 40px);
		padding: var(--button-p, 5px);
		border: none;
		border-radius: 10px;
		background-color: transparent;
		opacity: 1;
		transition: 0.2s;
		cursor: pointer;

		&_black:hover {
			background-color: rgba(0, 0, 0, 0.1) !important;
		}
		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
		&:active {
			opacity: 0.7;
		}

		& img {
			width: 100%;
			object-fit: contain;

			&.shadowed {
				filter: drop-shadow(0px 2px 0px var(--icon-sc, black));
			}
		}
	}
</style>
