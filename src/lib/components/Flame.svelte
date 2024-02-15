<script lang="ts">
	import flameGif from '$lib/assets/flame.gif';
	import { fly } from 'svelte/transition';

	// export let order: number;
	export let isVisible = false;
</script>

<div
	style="--flame-gif: url({flameGif});"
	class="flame"
	class:visible={isVisible}
	transition:fly={{ y: 300, duration: 1000 }}
/>

<style lang="scss">
	.flame {
		position: fixed;
		z-index: var(--flame-order, 0);
		border: 0;
		width: 100%;
		height: 100%;
		background-image: var(--flame-gif);
		background-size: var(--flame-size, 40vh);
		background-repeat: repeat-x;
		background-origin: center;
		background-position-y: 130%;
		background-position-x: center;
		transition: background-size 1s ease-in-out;
	}
</style>
