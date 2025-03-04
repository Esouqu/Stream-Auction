<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { ILot } from '$lib/interfaces';
	import { remToPx } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	interface Props {
		items: ILot[];
		itemSize: number;
		scrollElement?: HTMLDivElement | null;
		noFlipMode?: boolean;
		empty?: Snippet;
		children: Snippet<[ILot & { position: number }]>;
	}

	const itemsBuffer = 10;

	let { items, itemSize, scrollElement = $bindable(null), empty, children }: Props = $props();

	let scrollTop = $state(0);
	let itemHeight = $derived.by(() => remToPx(itemSize));
	let itemsBufferHeight = $derived(itemsBuffer * itemHeight);
	let minHeight = $state(0);
	let visibleItems: (ILot & { position: number })[] = $state([]);
	let mappedItems = $derived(items.map((l, idx) => ({ ...l, position: idx + 1 })));

	onMount(() => {
		if (scrollElement) {
			minHeight = scrollElement.offsetHeight;
		}
	});

	$effect(() => {
		if (scrollElement) {
			// Position of the top of the viewport
			const viewportTop = scrollTop - itemsBufferHeight;
			// Index of the potential start item
			const potentialStartIndex = Math.floor(viewportTop / itemHeight);
			// Position of the bottom of the viewport
			const viewportBottom = scrollTop + scrollElement.offsetHeight + itemsBufferHeight;
			// Index of the potential end item
			const potentialEndIndex = Math.floor(viewportBottom / itemHeight);
			// Ensure potentialEndIndex does not exceed the length of the mappedItems
			const clampedEndIndex = Math.min(mappedItems.length, potentialEndIndex);
			const startIndex = Math.max(0, potentialStartIndex);
			const endIndex = Math.max(startIndex, clampedEndIndex);

			visibleItems = mappedItems.slice(startIndex, endIndex);
		}
	});

	$effect(() => {
		if (scrollElement) {
			minHeight = Math.max(scrollElement.offsetHeight, itemHeight * mappedItems.length);
		}
	});

	function onscroll(e: UIEvent) {
		const target = e.target as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<ScrollArea class="relative flex h-full" bind:ref={scrollElement} {onscroll}>
	<div
		class="grid grid-flow-row transition-[height] [&_div:last-child]:border-0"
		style="grid-auto-rows: {itemHeight}px; height: {minHeight}px;"
	>
		{#each visibleItems as item (item.id)}
			<div
				class="flex border-b"
				style="grid-row: {item.position};"
				animate:flip={{ duration: 300 }}
			>
				{@render children(item)}
			</div>
		{:else}
			<div
				class="absolute top-[50%] translate-y-[-50%] w-full h-full flex justify-center items-center"
			>
				{#if empty}
					{@render empty()}
				{:else}
					<p class="text-lg font-medium text-muted-foreground">Пусто</p>
				{/if}
			</div>
		{/each}
	</div>
</ScrollArea>
