<script lang="ts">
	import flameGif from '$lib/assets/flame.gif';
	import { page } from '$app/stores';
	import { NAVIGATION_ROUTES } from '$lib/constants';

	export let level: number;
</script>

{#if $page.route.id === NAVIGATION_ROUTES.LOTS}
	<div style="--flame-gif: url({flameGif}); --flame-size: {40 + 15 * level}vh;" class="flame" />
{/if}

<style lang="scss">
	.flame {
		position: fixed;
		z-index: 0;
		border: 0;
		width: 100%;
		height: 100%;
		background-image: var(--flame-gif);
		background-size: var(--flame-size, 40vh);
		background-repeat: repeat-x;
		background-position-y: 170%;
		background-position-x: center;
		transition: background-size 3s ease-in-out;
		opacity: 0.7;
	}
</style>
