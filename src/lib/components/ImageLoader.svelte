<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Skeleton } from './ui/skeleton';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src: string;
		alt: string;
	}

	const { src, alt, class: className, ...props }: Props = $props();

	let loadedSrc: string | undefined = $state();

	onMount(() => {
		loadImage(src)
			.then((img) => (loadedSrc = img.src))
			.catch((error) => console.error(error));
	});

	function loadImage(url: string) {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = url;
		});
	}
</script>

<div class={['relative h-full w-full overflow-hidden rounded-md', className]} {...props}>
	{#if loadedSrc}
		<img
			data-slot="loader-image"
			src={loadedSrc}
			class="w-full rounded-md object-cover"
			{alt}
			draggable={false}
			in:scale={{ start: 0.9, opacity: 0 }}
		/>
	{:else}
		<Skeleton class="h-full w-full" />
	{/if}
</div>
