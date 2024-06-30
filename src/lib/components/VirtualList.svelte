<script lang="ts">
	import { flip } from 'svelte/animate';
	import settings from '$lib/stores/settings';
	import type { ILot } from '$lib/interfaces';
	import { onMount } from 'svelte';

	const itemHeight = 42;
	const itemsBuffer = 3;
	const itemsBufferHeight = itemsBuffer * itemHeight;

	export let autoScrollSpeed = 0.5;
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
	let scrollRestartTimeout: NodeJS.Timeout;
	let scrollAnimationId: number;

	onMount(() => {
		minHeight = scrollElement.offsetHeight;
		if (isAutoScrollEnabled) restartAutoScroll();

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
	$: if (isAutoScrollEnabled) restartAutoScroll(lots, 1000);

	function clearTimers() {
		clearTimeout(scrollResumeTimeout);
		clearTimeout(scrollRestartTimeout);
		cancelAnimationFrame(scrollAnimationId);
	}

	function animateFrame(frame: number) {
		if (isAutoScrollPaused || !scrollElement) return;

		const maxHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

		scrollElement.scrollTop = scrollTop;
		scrollTop = isScrollDown ? scrollTop + autoScrollSpeed : scrollTop - autoScrollSpeed;
		scrollAnimationId = requestAnimationFrame(animateFrame);

		if (isScrollDown && scrollTop >= maxHeight) {
			scrollTop = maxHeight;
			isScrollDown = false;

			restartAutoScroll();
		} else if (scrollTop <= 0) {
			scrollTop = 0;
			isScrollDown = true;

			restartAutoScroll();
		}
	}

	function startScrollAnimation() {
		scrollAnimationId = requestAnimationFrame(animateFrame);
	}

	function restartAutoScroll(lots: ILot[] = [], after = 2000) {
		if (!scrollElement || isAutoScrollPaused) return;

		isAutoScrollPaused = true;
		cancelAnimationFrame(scrollAnimationId);

		scrollRestartTimeout = setTimeout(() => {
			isAutoScrollPaused = false;
			startScrollAnimation();
		}, after);
	}

	function resumeAutoScroll() {
		if (!isAutoScrollEnabled) return;

		isAutoScrollPaused = false;
		clearTimeout(scrollResumeTimeout);

		scrollResumeTimeout = setTimeout(() => {
			isAutoScrollPaused = false;
			startScrollAnimation();
		}, 1000);
	}

	function pauseAutoScroll() {
		if (!isAutoScrollEnabled || isAutoScrollPaused) return;

		isAutoScrollPaused = true;
		clearTimers();
	}

	function onScroll(e: UIEvent) {
		if (!isAutoScrollPaused && isAutoScrollEnabled) return;

		const target = e.currentTarget as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<div
	class="virtual-list-wrapper"
	on:scroll={onScroll}
	on:mouseenter={pauseAutoScroll}
	on:mouseleave={resumeAutoScroll}
	on:dragover={pauseAutoScroll}
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
				class:odd={item.position % 2 === 0}
				class:even={item.position % 2 === 1}
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
			width: 100%;

			&:not(:last-child) {
				border-bottom: 1px solid var(--outline-variant);
			}
			&.odd::before,
			&.even::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: var(--row-opacity, 1);
			}

			&.odd::before {
				background-color: var(--surface-container);
			}
			&.even::before {
				background-color: var(--surface-container-high);
			}

			&:hover {
				background-color: var(--primary-70-30);
			}
		}
	}
</style>
