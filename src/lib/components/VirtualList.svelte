<script lang="ts">
	import { flip } from 'svelte/animate';
	import { getTotal } from '$lib/utils';
	import lots from '$lib/stores/lots';
	import Lot from './Lot.svelte';

	// amount of items to remove from outside visible view
	const itemsOffset = 2;

	let itemHeight = 42;
	let scrollTop = 0;
	let windowHeight: number;
	let startIndex: number;
	let endIndex: number;
	let visibleItems: typeof sortedLots = [];

	$: sortedLots = [...$lots]
		.sort((a, b) => b.value - a.value)
		.map((l, idx) => ({ ...l, position: idx + 1 }));
	$: total = getTotal($lots.map((l) => l.value));

	$: {
		startIndex = Math.floor(scrollTop / itemHeight);
		endIndex = Math.min(
			sortedLots.length,
			Math.floor((scrollTop + windowHeight - itemsOffset * itemHeight) / itemHeight)
		);

		visibleItems = sortedLots.slice(startIndex, endIndex);
	}

	function onScroll(e: UIEvent) {
		const target = e.currentTarget as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="scroll" on:scroll={onScroll}>
	<div
		class="inner"
		style="grid-template-rows: repeat({Math.max(15, sortedLots.length)}, {itemHeight}px);"
	>
		{#each visibleItems as item (item.id)}
			{@const percent = (item.value / total) * 100}
			{@const { position, donators, ...rest } = item}

			<div style="grid-row: {item.position};" animate:flip={{ duration: 300 }}>
				<Lot {...rest} {percent} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.scroll {
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
	.inner {
		position: relative;
		display: grid;
		padding: 10px 30px;
	}
</style>
