<script lang="ts">
	import FireGif from '$lib/assets/fire.gif';
	import { fly } from 'svelte/transition';

	interface Props {
		amount: number;
	}

	const { amount }: Props = $props();
</script>

{#if amount > 0}
	<div
		class="absolute left-0 top-0 h-full w-full bg-cover bg-bottom bg-no-repeat transition-all duration-1000 ease-in-out"
		style={`background-image: url(${FireGif}); translate: 0 ${20 + -5 * amount}rem;`}
		transition:fly={{ y: 200, duration: 1000 }}
	></div>
{/if}
