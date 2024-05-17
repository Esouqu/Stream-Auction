<script lang="ts">
	import { flip } from 'svelte/animate';
	import settings from '$lib/stores/settings';
	import type { ILot } from '$lib/interfaces';
	import { onMount } from 'svelte';

	const itemHeight = 42;
	const itemsBuffer = 3;
	const itemsBufferHeight = itemsBuffer * itemHeight;
	const autoScrollSpeed = 1;

	export let lots: ILot[] = [];
	export let isAutoScrollEnabled = false;

	let scrollTop = 0;
	let scrollElement: HTMLDivElement;
	let startIndex: number;
	let endIndex: number;
	let minHeight: number;
	let visibleItems: (ILot & { position: number })[] = [];

	let isAutoScrollPaused = false;
	let isScrollDown = true;
	let scrollResumeTimeout: NodeJS.Timeout;
	let scrollInterval: NodeJS.Timeout;
	let scrollRestartTimeout: NodeJS.Timeout;

	onMount(() => {
		minHeight = scrollElement.offsetHeight;
		if (isAutoScrollEnabled) autoScroll();

		return clearTimers;
	});

	$: transparency = settings.transparency;
	$: mappedLots = [...lots].map((l, idx) => ({ ...l, position: idx + 1 }));
	$: {
		if (scrollElement) {
			// Position of the top of the viewport
			const viewportTop = scrollTop - itemsBufferHeight;
			// Index of the potential start item
			const potentialStartIndex = Math.floor(viewportTop / itemHeight);
			// Position of the bottom of the viewport
			const viewportBottom = scrollTop + scrollElement.offsetHeight + itemsBufferHeight;
			// Index of the potential end item
			const potentialEndIndex = Math.floor(viewportBottom / itemHeight);
			// Ensure potentialEndIndex does not exceed the length of the mappedQueue
			const clampedEndIndex = Math.min(mappedLots.length, potentialEndIndex);

			startIndex = Math.max(0, potentialStartIndex);
			endIndex = Math.max(startIndex, clampedEndIndex);
			visibleItems = mappedLots.slice(startIndex, endIndex);
			minHeight = Math.max(scrollElement.offsetHeight, itemHeight * mappedLots.length);
		}
	}

	function clearTimers() {
		clearTimeout(scrollResumeTimeout);
		clearTimeout(scrollRestartTimeout);
		clearInterval(scrollInterval);
	}

	function restartAutoScroll(time = 2000) {
		clearInterval(scrollInterval);
		scrollRestartTimeout = setTimeout(() => {
			autoScroll();
		}, time);
	}

	function autoScroll() {
		if (isAutoScrollPaused) return;

		const maxHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

		scrollInterval = setInterval(() => {
			scrollElement.scrollTop = scrollTop;
			scrollTop = isScrollDown ? scrollTop + autoScrollSpeed : scrollTop - autoScrollSpeed;

			if (isScrollDown && scrollTop >= maxHeight) {
				scrollTop = maxHeight;
				isScrollDown = false;

				restartAutoScroll();
			} else if (scrollTop <= 0) {
				scrollTop = 0;
				isScrollDown = true;

				restartAutoScroll();
			}
		}, 10);
	}

	function pauseAutoScroll() {
		if (!isAutoScrollEnabled) return;

		isAutoScrollPaused = true;
		clearTimers();
	}

	function resumeAutoScroll() {
		if (!isAutoScrollEnabled) return;

		isAutoScrollPaused = false;

		scrollResumeTimeout = setTimeout(() => {
			isAutoScrollPaused = false;
			autoScroll();
		}, 1000);
	}

	function onScroll(e: UIEvent) {
		const target = e.currentTarget as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<div
	class="virtual-list-wrapper"
	on:scroll={onScroll}
	on:mouseenter={pauseAutoScroll}
	on:mouseleave={resumeAutoScroll}
	bind:this={scrollElement}
	aria-hidden
>
	<ul
		class="virtual-list"
		style="grid-auto-rows: {itemHeight}px; height: {minHeight}px; --row-opacity: {$transparency};"
	>
		{#each visibleItems as item (item.id)}
			<li
				class="virtual-list-row"
				style="grid-row: {item.position};"
				animate:flip={{ duration: 300 }}
			>
				<slot {item} />
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.virtual-list {
		position: relative;
		display: grid;
		grid-auto-flow: row;
		padding: 0;
		margin: 0;
		list-style-type: none;
		transition: height 0.2s ease 0.2s;

		&-wrapper {
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			scrollbar-gutter: stable;
		}

		&-row {
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
				opacity: var(--row-opacity, 1);
			}

			&:nth-child(odd)::before {
				background-color: var(--surface-container);
			}
			&:nth-child(even)::before {
				background-color: var(--surface-container-high);
			}
			// &:last-child::before {
			// 	border-bottom: 3px solid var(--primary-50);
			// }

			&:hover {
				background-color: var(--primary-70-30);
			}
		}
	}
</style>
