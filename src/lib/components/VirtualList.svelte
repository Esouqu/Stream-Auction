<script lang="ts">
	import { flip } from 'svelte/animate';
	import settings from '$lib/stores/settings';
	import type { ILot } from '$lib/interfaces';

	const itemHeight = 42;
	const itemsBuffer = 2;
	const itemsBufferHeight = itemsBuffer * itemHeight;

	export let lots: ILot[] = [];
	export let minItems = 15;

	let scrollTop = 0;
	let windowHeight: number;
	let startIndex: number;
	let endIndex: number;
	let visibleItems: (ILot & { position: number })[] = [];

	$: transparency = settings.transparency;
	$: mappedLots = [...lots].map((l, idx) => ({ ...l, position: idx + 1 }));
	$: {
		// Position of the top of the viewport
		const viewportTop = scrollTop - itemsBufferHeight;
		// Index of the potential start item
		const potentialStartIndex = Math.floor(viewportTop / itemHeight);
		// Position of the bottom of the viewport
		const viewportBottom = scrollTop + windowHeight;
		// Index of the potential end item
		const potentialEndIndex = Math.floor(viewportBottom / itemHeight);
		// Ensure potentialEndIndex does not exceed the length of the mappedQueue
		const clampedEndIndex = Math.min(mappedLots.length, potentialEndIndex);

		startIndex = Math.max(0, potentialStartIndex);
		endIndex = Math.max(startIndex, clampedEndIndex);
		visibleItems = mappedLots.slice(startIndex, endIndex);
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
		style="grid-template-rows: repeat({Math.max(minItems, mappedLots.length)}, {itemHeight}px);"
	>
		{#each visibleItems as item (item.id)}
			<div
				class="grid-row"
				style="--grid-row-opacity: {$transparency}; grid-row: {item.position};"
				animate:flip={{ duration: 300 }}
			>
				<slot {item} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.scroll {
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-gutter: stable;
	}
	.inner {
		position: relative;
		display: grid;
	}
	.grid-row {
		position: relative;
		display: flex;
		border-bottom: 1px solid var(--outline-variant);
		width: 100%;

		&:nth-child(odd)::before,
		&:nth-child(even)::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: var(--grid-row-opacity, 1);
		}

		&:nth-child(odd)::before {
			background-color: var(--surface-container);
		}
		&:nth-child(even)::before {
			background-color: var(--surface-container-high);
		}
		&:last-child::before {
			border-bottom: 3px solid var(--primary-50);
		}

		&:hover {
			background-color: var(--primary-70-30);
		}
	}
</style>
