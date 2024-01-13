<script lang="ts">
	import type { iconTypes } from '$lib/icons';
	import getIcon from '$lib/icons';

	export let icon: iconTypes;
	export let text: string = '';
	export let color: 'white' | 'black' = 'white';
	export let isDisabled: boolean = false;
	export let shadowColor: string | null = null;
</script>

<button
	type="button"
	class="icon-button"
	class:icon-button_text={text}
	class:icon-button_black={color === 'black'}
	class:icon-button_white={color === 'white'}
	style="--btn-shadow-c: {shadowColor}"
	disabled={isDisabled}
	on:click|stopPropagation
>
	<img
		class:shadowed={!!shadowColor}
		src={getIcon(icon, color)}
		alt="Icon button"
		draggable="false"
	/>
	{#if text}
		<div>
			<span>{text}</span>
		</div>
	{/if}
</button>

<style lang="scss">
	.icon-button {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		min-width: var(--button-size, 40px);
		height: var(--button-size, 40px);
		padding: var(--button-p, 5px);
		border: none;
		border-radius: 10px;
		background-color: transparent;
		opacity: 1;
		transition: 0.2s;
		user-select: none;
		cursor: pointer;

		&_text {
			width: auto;

			& div {
				display: flex;
				width: 100%;

				& span {
					display: inline-block;
					max-width: 200px;
					height: 100%;
					font-weight: 700;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}
			& img {
				width: fit-content !important;
				height: 100%;
			}
		}
		&_black {
			color: black;

			&:hover {
				background-color: rgba(0, 0, 0, 0.1) !important;
			}
		}
		&_white {
			color: white;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1) !important;
			}
		}

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
		&:active {
			opacity: 0.7;
		}
		&:disabled {
			opacity: 0.3;
			pointer-events: none;
		}

		& img {
			/* width: 100%; */
			object-fit: contain;
		}
	}
</style>
