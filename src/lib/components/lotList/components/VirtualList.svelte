<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { ILot } from '$lib/interfaces';
	import { flip } from 'svelte/animate';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	interface Props {
		items: ILot[];
		isPadded?: boolean;
		scrollElement?: HTMLDivElement | null;
		empty?: Snippet;
		children: Snippet<[ILot & { position: number }]>;
	}

	const itemsBuffer = 10;
	const itemHeight = 44;
	const itemsBufferHeight = itemsBuffer * itemHeight;
	const paddingBottom = 84;

	let {
		items,
		isPadded = false,
		scrollElement = $bindable(null),
		empty,
		children
	}: Props = $props();

	let scrollTop = $state(0);
	let minHeight = $state(0);
	let itemsWithPosition = $derived.by(getItemsWithPosition);
	let visibleItems = $derived.by(getVisibleItems);

	$effect(() => {
		onresize();
	});

	function getItemsWithPosition() {
		return items.map((l, idx) => ({ ...l, position: idx + 1 }));
	}

	function getVisibleItems() {
		if (!scrollElement) return [];

		const viewportTop = scrollTop - itemsBufferHeight;
		// Index of the potential start item
		const potentialStartIndex = Math.floor(viewportTop / itemHeight);
		// Position of the bottom of the viewport
		const viewportBottom = scrollTop + scrollElement.offsetHeight + itemsBufferHeight;
		// Index of the potential end item
		const potentialEndIndex = Math.floor(viewportBottom / itemHeight);
		// Ensure potentialEndIndex does not exceed the length of the itemsWithPosition
		const clampedEndIndex = Math.min(itemsWithPosition.length, potentialEndIndex);
		const startIndex = Math.max(0, potentialStartIndex);
		const endIndex = Math.max(startIndex, clampedEndIndex);

		return itemsWithPosition.slice(startIndex, endIndex);
	}

	function onresize() {
		if (!scrollElement) return;

		const offsetHeight = scrollElement.offsetHeight;
		const itemsHeight = itemHeight * itemsWithPosition.length;
		const paddedHeight = isPadded ? itemsHeight + paddingBottom : itemsHeight;

		minHeight = Math.max(offsetHeight, paddedHeight);
	}

	function onscroll(e: UIEvent) {
		const target = e.target as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<svelte:window {onresize} />

<ScrollArea class="relative flex h-full overflow-hidden" bind:ref={scrollElement} {onscroll}>
	<div
		class="grid grid-flow-row transition-[height] [&_div:last-child]:border-0"
		style="grid-auto-rows: {itemHeight}px; height: {minHeight}px;"
	>
		{#each visibleItems as item (item.id)}
			<div
				class="flex border-input/30 data-[even=true]:bg-input/15"
				style="grid-row: {item.position};"
				data-even={item.position % 2 === 0}
				animate:flip={{ duration: 400 }}
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
