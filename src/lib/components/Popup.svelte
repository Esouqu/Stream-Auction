<script lang="ts">
	import { fade } from 'svelte/transition';

	export let isOpened = false;
	export let width: string = 'auto';
	export let onClose: (() => void) | null = null;

	let element: HTMLDivElement;

	$: element && document.body.appendChild(element);

	function closePopup() {
		isOpened = false;
		if (onClose) onClose();
	}
</script>

{#if isOpened}
	<div
		class="popup"
		style="--popup-width: {width};"
		bind:this={element}
		transition:fade={{ duration: 200 }}
	>
		<div class="popup-backdrop" on:click={closePopup} aria-hidden />
		<div class="popup-inner">
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	.popup {
		position: absolute;
		z-index: 999;

		&-backdrop {
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgb(0 0 0 / 60%);
			cursor: pointer;
		}
		&-inner {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 30px;
			border-radius: 8px;
			min-width: 400px;
			width: var(--popup-width);
			max-width: 600px;
			max-height: calc(90vh - 60px);
			color: var(--on-surface);
			background-color: var(--surface-container-highest);
			box-shadow: var(--elevation-1);
			transition: 0.3s;
			overflow: hidden auto;
		}
		&::before {
			content: '';
		}
	}
</style>
