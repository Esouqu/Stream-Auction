<script lang="ts">
	import { flip } from 'svelte/animate';
	import settings from '$lib/stores/settings';
	import type { ILot } from '$lib/interfaces';
	import { onMount } from 'svelte';
	import lots from '$lib/stores/lots';

	enum AUTOSCROLL_STATE {
		IDLE = 'idle',
		PAUSED = 'paused',
		RUNNING = 'running'
	}

	const itemHeight = 42;
	const itemsBuffer = 3;
	const itemsBufferHeight = itemsBuffer * itemHeight;
	const borderSize = 3;
	const lotsUpdateDelay = 2000;
	const directionChangeDelay = 3000;

	export let items: ILot[] = [];
	export let autoScrollSpeed = 0.5;
	export let isAutoScrollEnabled = false;

	let state = AUTOSCROLL_STATE.IDLE;
	let visibleItems: (ILot & { position: number })[] = [];
	let scrollTop = 0;
	let isScrollDown = true;
	let scrollElement: HTMLDivElement;
	let startIndex: number;
	let endIndex: number;
	let minHeight: number;
	let scrollAnimationId: number;
	let scrollResumeTimeout: NodeJS.Timeout;

	onMount(() => {
		minHeight = scrollElement.offsetHeight;

		const unsubLastAddedLot = lots.lastAddedItem.subscribe(onLotsUpdate);
		const unsubLastUpdatedLot = lots.lastUpdatedItem.subscribe(onLotsUpdate);

		return () => {
			unsubLastAddedLot();
			unsubLastUpdatedLot();
			stopAnimation();
		};
	});

	$: transparency = settings.transparency;
	$: mappedLots = items.map((l, idx) => ({ ...l, position: idx + 1 }));
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
			minHeight =
				Math.max(scrollElement.offsetHeight, itemHeight * mappedLots.length) - borderSize * 2;
		}
	}

	function onLotsUpdate(_lot: (ILot & { addedValue?: number }) | undefined) {
		if (!isAutoScrollEnabled || isPaused()) return;

		resumeAutoScroll(lotsUpdateDelay);
	}

	function isPaused() {
		return state === AUTOSCROLL_STATE.PAUSED;
	}

	function stopAnimation() {
		clearTimeout(scrollResumeTimeout);
		cancelAnimationFrame(scrollAnimationId);
	}

	function animateFrame(frame: number) {
		if (!scrollElement || isPaused()) return;

		const maxHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

		scrollElement.scrollTop = scrollTop;
		scrollTop = isScrollDown ? scrollTop + autoScrollSpeed : scrollTop - autoScrollSpeed;
		scrollAnimationId = requestAnimationFrame(animateFrame);

		if (isScrollDown && scrollTop >= maxHeight) {
			scrollTop = maxHeight;
			isScrollDown = false;

			resumeAutoScroll(directionChangeDelay);
			return;
		} else if (scrollTop <= 0) {
			scrollTop = 0;
			isScrollDown = true;

			resumeAutoScroll(directionChangeDelay);
			return;
		}
	}

	function resumeAutoScroll(after: number, _lots: ILot[] = []) {
		if (!scrollElement || !isAutoScrollEnabled) return;

		stopAnimation();
		state = AUTOSCROLL_STATE.PAUSED;

		scrollResumeTimeout = setTimeout(() => {
			state = AUTOSCROLL_STATE.RUNNING;
			scrollAnimationId = requestAnimationFrame(animateFrame);
		}, after);
	}

	function pauseAutoScroll() {
		if (!isAutoScrollEnabled) return;

		state = AUTOSCROLL_STATE.PAUSED;
		stopAnimation();
	}

	function onScroll(e: UIEvent) {
		if (!isPaused() && isAutoScrollEnabled) return;

		const target = e.currentTarget as HTMLDivElement;

		scrollTop = target.scrollTop;
	}
</script>

<div
	class="virtual-list-wrapper"
	on:scroll={onScroll}
	on:mouseenter={pauseAutoScroll}
	on:mouseleave={() => resumeAutoScroll(directionChangeDelay)}
	on:dragover={pauseAutoScroll}
	on:dragleave={() => resumeAutoScroll(directionChangeDelay)}
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
			border: 3px solid var(--primary-50);
			border-radius: 0 0 8px 8px;
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
