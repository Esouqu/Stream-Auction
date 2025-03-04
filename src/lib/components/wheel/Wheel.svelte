<script lang="ts">
	import { degreesToRadians, radiansToDegrees } from '$lib/constants';
	import { getShortenedText } from '$lib/utils';
	import Color from 'color';
	import { onMount, tick, untrack } from 'svelte';
	import Pointer from './components/Pointer.svelte';
	import Outline from './components/Outline.svelte';
	import InnerHole from './components/InnerHole.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import type { ILot } from '$lib/interfaces';

	interface ILotWithAngle extends ILot {
		startAngle: number;
		endAngle: number;
	}

	interface Props {
		patternImage: string | null;
	}

	const { patternImage }: Props = $props();

	const textMinAngleCap = 5;
	const app = getAppManagerContext();
	const { wheel, lots } = app;

	let containerRef: HTMLDivElement | undefined = $state();
	let canvasContainerRef: HTMLDivElement | undefined = $state();
	let canvasRef: HTMLCanvasElement | undefined = $state();
	let ctx = $derived(canvasRef?.getContext('2d'));

	let resizeWidth = $state(0);
	let resizeHeight = $state(0);
	let isDragging = $state(false);
	let lotsWithAngles = $derived.by(getLotsWithAngles);
	let winner = $derived.by(getWinner);
	let radius = $derived(Math.floor(Math.min(resizeHeight, resizeWidth) / 2.25));
	let holeSize = $derived(radius / 1.5);
	let textOffsetFromCenter = $derived(Math.min(1, Math.max(0, (radius * 0.38) / radius)));
	let textSize = $derived((radius / 100) * 4.5);
	let fontStyle = $derived(`700 ${textSize}px sans-serif`);
	let maxSliceTextWidth = $derived(radius / 2);
	let lineWidth = $derived(lotsWithAngles.length > 300 ? 1 : 3);

	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;
	let draggingStartAngle: number;
	let pattern: CanvasPattern | undefined = $state();
	let isAnimating = false;

	onMount(() => {
		onresize();
		animatePieChart();

		return () => {
			if (patternImage) {
				URL.revokeObjectURL(patternImage);
			}
		};
	});

	$effect(() => {
		if (ctx) {
			ctx.font = fontStyle;
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'start';
		}
	});

	$effect(() => {
		patternImage;

		loadPattern();
	});

	$effect(() => {
		lotsWithAngles;
		resizeHeight;
		resizeWidth;
		pattern;

		if (!isAnimating) {
			untrack(() => {
				drawPieChart(1);
			});
		}
	});

	async function loadPattern() {
		await new Promise<void>((resolve) => {
			if (patternImage) {
				const img = new Image();
				img.src = patternImage;
				img.onload = () => {
					pattern = ctx!.createPattern(img, 'repeat')!;
					pattern.setTransform(new DOMMatrix([0.3, 0, 0, 0.3, 0, 0]));
					resolve();
				};
			} else {
				pattern = undefined;
				resolve();
			}
		});
	}

	function drawStroke(centerX: number, centerY: number, progress: number) {
		if (!ctx) return;

		ctx.strokeStyle = '#27272a';
		ctx.lineWidth = lineWidth;

		ctx.beginPath();

		for (const lot of lotsWithAngles) {
			const { startAngle, endAngle } = lot;
			ctx.moveTo(centerX, centerY);
			ctx.arc(
				centerX,
				centerY,
				Math.min(radius * progress, radius),
				startAngle * degreesToRadians,
				endAngle * degreesToRadians,
				false
			);
		}

		ctx.stroke();
	}

	function drawText({ title, startAngle, endAngle, isDarkColor }: ILotWithAngle, progress: number) {
		if (!ctx) return;

		const midAngle = (startAngle + endAngle) / 2;
		const cosMidAngle = Math.cos(midAngle * degreesToRadians);
		const sinMidAngle = Math.sin(midAngle * degreesToRadians);
		const textX = radius + radius * textOffsetFromCenter * cosMidAngle;
		const textY = radius + radius * textOffsetFromCenter * sinMidAngle;

		if (progress < 1) {
			ctx.globalAlpha = progress;
		}

		ctx.fillStyle = isDarkColor ? 'white' : 'black';

		ctx.save();
		ctx.translate(textX, textY);
		ctx.rotate(midAngle * degreesToRadians);
		ctx.fillText(getShortenedText(title, fontStyle, maxSliceTextWidth), 0, 0);
		ctx.restore();
	}

	function drawBody(lot: ILotWithAngle, centerX: number, centerY: number, progress: number) {
		if (!ctx) return;

		const { startAngle, endAngle, color } = lot;

		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(
			centerX,
			centerY,
			Math.min(radius * progress, radius),
			startAngle * degreesToRadians,
			endAngle * degreesToRadians
		);

		if (pattern) {
			ctx.fillStyle = pattern;
			ctx.fill();
		}

		ctx.fillStyle = `rgb(${color.r} ${color.g} ${color.b} / 90%)`;
		ctx.fill();
	}

	function drawPieChart(progress: number) {
		if (!ctx || !canvasRef) return;

		const centerX = canvasRef.width / 2;
		const centerY = canvasRef.height / 2;

		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

		for (const lot of lotsWithAngles) {
			const { startAngle, endAngle } = lot;
			const angleDiff = endAngle - startAngle;

			drawBody(lot, centerX, centerY, progress);
			if (angleDiff >= textMinAngleCap) drawText(lot, progress);
		}

		ctx.globalAlpha = 1;

		drawStroke(centerX, centerY, progress);
	}

	async function animatePieChart() {
		if (!ctx || !canvasRef) return;

		await tick();

		const start = performance.now();
		isAnimating = true;
		const draw = (progress: number) => {
			drawPieChart(progress);

			if (progress < 1) {
				const timeElapsed = performance.now() - start;
				const progress = timeElapsed / 500;
				requestAnimationFrame(() => draw(progress));
			} else {
				isAnimating = false;
			}
		};
		draw(0);
	}

	function getWinner() {
		let left = 0;
		let right = lotsWithAngles.length - 1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			const item = lotsWithAngles[mid];
			const targetRotation = wheel.normalizedRotation;

			if (item.startAngle <= targetRotation && item.endAngle >= targetRotation) {
				return item; // Return the item found
			}

			if (targetRotation < item.startAngle) {
				right = mid - 1; // Search in the left half
			} else {
				left = mid + 1; // Search in the right half
			}
		}

		return null; // If not found, return null or appropriate value
	}

	function getLotsWithAngles() {
		if (!lots.items) return [];

		const totalValue = lots.totalValue;
		let cumulative = 0;

		return lots.items.map((item) => {
			const angle = (item.value / totalValue) * 360;
			const startAngle = cumulative;
			cumulative += angle;

			return { ...item, startAngle, endAngle: cumulative };
		});
	}

	async function onresize() {
		if (!containerRef) return;

		await tick();

		resizeHeight = containerRef.clientHeight;
		resizeWidth = containerRef.clientWidth;

		if (!canvasContainerRef) return;

		wheelWidth = canvasContainerRef.getBoundingClientRect().width;
		wheelHeight = canvasContainerRef.getBoundingClientRect().height;
		wheelX = canvasContainerRef.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = canvasContainerRef.getBoundingClientRect().y + wheelHeight / 2;
	}

	function onmouseup() {
		isDragging = false;
		document.body.classList.remove('grabbing');
	}

	function onmousemove(e: MouseEvent) {
		if (isDragging) {
			const angle = Math.atan2(e.clientY - wheelY, e.clientX - wheelX);

			wheel.rotation += (angle - draggingStartAngle) * radiansToDegrees;
			draggingStartAngle = angle;
		}
	}

	function onmousedown(e: MouseEvent) {
		isDragging = true;
		document.body.classList.add('grabbing');
		draggingStartAngle = Math.atan2(e.clientY - wheelY, e.clientX - wheelX);
	}
</script>

<svelte:window {onresize} {onmousemove} {onmouseup} />

<div
	class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4"
	bind:this={containerRef}
>
	<div class="relative flex">
		{#if radius > 0}
			<InnerHole {winner} size={holeSize} {patternImage} />
			<Outline color={Color(winner?.color).hex()} />
			<Pointer trigger={winner?.id} />
		{/if}
		<div
			class="cursor-grab select-none data-[inactive=true]:pointer-events-none data-[grabbing=true]:cursor-grabbing"
			data-grabbing={isDragging}
			data-inactive={wheel.isSpinning || wheel.isDelayed}
			style="transform: rotate({wheel.rotation}deg);"
			draggable="false"
			aria-hidden="true"
			bind:this={canvasContainerRef}
			{onmousedown}
		>
			<canvas
				bind:this={canvasRef}
				class="pointer-events-none rotate-[-90deg]"
				width={radius * 2}
				height={radius * 2}
			></canvas>
		</div>
	</div>
</div>
