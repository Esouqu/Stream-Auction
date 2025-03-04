<script lang="ts">
	import { page } from '$app/stores';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import Fire from './Fire.svelte';

	const app = getAppManagerContext();
	const { background } = app;
</script>

<div class="absolute left-0 top-0 z-[-1] h-full w-full">
	{#if background.url}
		{#if background.type === 'video'}
			<video class=" h-[inherit] w-full object-cover" controls={false} autoplay muted loop>
				<source src={background.url} />
				<track kind="captions" />
			</video>
		{:else if background.type === 'image'}
			<div
				class="h-[inherit] w-full bg-cover bg-center bg-no-repeat"
				style="background-image: url({background.url});"
			></div>
		{/if}
	{/if}

	{#if $page.route.id === '/'}
		<Fire amount={background.currentFlameSize} />
	{/if}

	<div
		class="absolute left-0 top-0 h-full w-full bg-background"
		style="--tw-bg-opacity: {background.floatDimness};"
	></div>
</div>
