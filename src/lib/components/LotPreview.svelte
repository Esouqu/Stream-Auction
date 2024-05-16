<script lang="ts">
	import donations from '$lib/stores/donations';
	import lots from '$lib/stores/lots';
	import anime from 'animejs';
	import { onMount } from 'svelte';

	export let id: number;
	export let title: string;
	export let color: string;
	export let percent: number;

	let animation: anime.AnimeInstance;
	let isHovered = false;
	let element: HTMLDivElement;

	onMount(() => {
		return lots.lotValueChanged.subscribe((lot) => {
			if (lot?.id === id) animate();
		});
	});

	function animate() {
		if (animation) {
			animation.restart();
		} else {
			animation = anime({
				targets: element,
				scale: 1.05,
				backgroundColor: color,
				easing: 'easeOutCubic',
				direction: 'alternate',
				duration: 350
			});
		}
	}

	function handleDrop(e: DragEvent) {
		const data = e.dataTransfer?.getData('application/json');
		if (!data || !isValidData(e)) return;

		const donation = JSON.parse(data);

		lots.addValue(id, donation.value, donation.username);
		donations.remove(donation.id);
		isHovered = false;
	}

	function handleDragOver(e: DragEvent) {
		if (isValidData(e)) isHovered = true;
	}

	function handleDragLeave(e: DragEvent) {
		if (isValidData(e)) isHovered = false;
	}

	function isValidData(e: DragEvent) {
		const data = e.dataTransfer;
		if (!data) return false;

		return data.types.includes('application/json');
	}
</script>

<div
	class="lot-preview"
	class:hovered={isHovered}
	data-lot-id="#{id}"
	aria-hidden
	{title}
	bind:this={element}
	on:dragover|preventDefault={(e) => handleDragOver(e)}
	on:dragleave|preventDefault={(e) => handleDragLeave(e)}
	on:drop|preventDefault={(e) => handleDrop(e)}
>
	<div class="lot-preview__id" style="--lot-id-color: {color};">
		#{id}
	</div>
	<div style="display: grid; width: 100%;">
		<div class="lot-preview__title">{title}</div>
	</div>
	<div class="lot-preview__percent">{Number(percent.toFixed(1))}%</div>
</div>

<style lang="scss">
	.lot-preview {
		display: flex;
		align-items: center;
		width: 100%;

		&__title {
			z-index: 0;
			padding: 10px;
			width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: 0.25px;
			overflow: hidden;
		}

		&__id {
			position: relative;
			display: flex;
			z-index: 1;
			align-items: center;
			justify-content: center;
			margin-right: 10px;
			min-width: 60px;
			height: 100%;
			font-weight: 500;
			color: white;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				background-color: var(--lot-id-color, transparent);
				opacity: 0.4;
			}
		}

		&__percent {
			z-index: 0;
			display: flex;
			align-self: center;
			justify-content: center;
			padding: 0 10.5px;
			min-width: 90px;
			font-variant-numeric: tabular-nums;
			letter-spacing: 0.25px;
		}

		&.hovered {
			z-index: 999;
			outline: 3px solid white;
		}
	}
</style>
