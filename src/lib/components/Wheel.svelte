<script lang="ts">
	import {
		extractUrl,
		fireConfetti,
		getGrayscaleColor,
		getPercentFromTotal,
		getShortenedText,
		getTotal,
		modifyBrightness
	} from '$lib/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import wheel from '$lib/stores/wheel';
	import type { ILot, IPieItem } from '$lib/interfaces';
	import { WHEEL_STATE, degreesToRadians, radiansToDegrees } from '$lib/constants';
	import winnerSound from '$lib/assets/sounds/winner_sound.wav';
	import { beforeNavigate } from '$app/navigation';

	const offset = 20;
	const degreeCapForTextDisplay = Number(((400 / 100) * 3).toFixed(2));

	export let winner: IPieItem | null = null;

	let radius = 360;
	let isDragging = false;
	let isSettingsShown = true;
	let draggingStartAngle = 0;
	let draggingAngle = 0;

	let wheelState: WHEEL_STATE = WHEEL_STATE.IDLE;
	let celebrationSound: HTMLAudioElement;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let wheelElement: HTMLElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;
	let resizeElement: HTMLDivElement;
	let pie: IPieItem[] = [];

	$: width = radius * 2;
	$: offsetCenter = radius + offset / 2;
	$: angle = wheel.angle;
	$: normalizedAngle = wheel.normalizedAngle;
	$: canvasRotation = isDragging ? draggingAngle : $angle;
	$: {
		getWinner($normalizedAngle);
	}
	$: {
		if (isDragging) {
			drawChart(pie);
		}
	}

	beforeNavigate(() => {
		if (wheelState === WHEEL_STATE.STOPPED) wheel.state.set(WHEEL_STATE.IDLE);
	});

	onMount(() => {
		const unsubLots = lots.subscribe((store) => {
			const updatedPie = createPie(store);

			pie = updatedPie;
			drawChart(updatedPie);

			if (wheelState !== WHEEL_STATE.IDLE && wheelState !== WHEEL_STATE.STOPPED) {
				getWinner($normalizedAngle);
			}
		});

		const unsubWheelState = wheel.state.subscribe((store) => {
			wheelState = store;

			if (store === WHEEL_STATE.STOPPED) {
				isSettingsShown = true;
				getWinner($normalizedAngle);
				celebrate();
			}
			if (store !== WHEEL_STATE.IDLE && store !== WHEEL_STATE.DELAYED) {
				drawChart(pie);
			}
		});

		context = canvas.getContext('2d');

		loadAudio();
		onResize();
		drawChart(pie);

		return () => {
			unsubLots();
			unsubWheelState();
		};
	});

	function loadAudio() {
		celebrationSound = new Audio(winnerSound);
		celebrationSound.preload;
		celebrationSound.volume = 0.2;

		// spinSound.preload;
		// spinSound.volume = 0.2;
	}

	function celebrate() {
		celebrationSound.load();
		celebrationSound.play();
		fireConfetti();
	}

	function createPie(items: ILot[]) {
		const total = getTotal(items.map((item) => item.value));

		let startAngle: number;
		let endAngle: number;

		return items.map((item, idx) => {
			const deg = (item.value / total) * 360;
			const isUrl = extractUrl(item.title);

			startAngle = idx && endAngle;
			endAngle = !idx ? deg : startAngle + deg;

			return {
				...item,
				percent: getPercentFromTotal(item.value, total),
				startAngle,
				endAngle,
				isUrl: !!isUrl
			};
		});
	}

	function drawPieSliceText(title: string, color: string, startAngle: number, endAngle: number) {
		if (!context || endAngle - startAngle < degreeCapForTextDisplay) return;

		const maxTitleLength = Number(((radius / 100) * 5.75).toFixed(2));
		const shortTitle = getShortenedText(title, maxTitleLength);
		const textAngle = (startAngle + endAngle) / 2; // Find the middle angle of the slice
		const offsetFromCenter = 0.8; // 0 = right at the center | 1 = right on the edge
		const textX =
			offsetCenter + offsetCenter * offsetFromCenter * Math.cos(textAngle * degreesToRadians);
		const textY =
			offsetCenter + offsetCenter * offsetFromCenter * Math.sin(textAngle * degreesToRadians);

		context.font = '700 20px sans-serif';
		context.textBaseline = 'middle';
		context.textAlign = 'start';
		context.fillStyle = color;

		context.save(); // Save the current canvas state
		context.translate(textX, textY); // Move the canvas origin to the text position
		context.rotate((textAngle + 180) * degreesToRadians); // Rotate the canvas by textAngle - 90 degrees
		context.fillText(shortTitle, 0, 0);
		context.restore(); // Restore the canvas state to remove the translation and rotation
	}

	function drawPieSlice(
		startAngle: number,
		endAngle: number,
		color: string,
		isWinner: boolean = false
	) {
		if (!context) return;

		context.beginPath();
		context.moveTo(offsetCenter, offsetCenter);
		context.arc(
			offsetCenter,
			offsetCenter,
			radius,
			startAngle * degreesToRadians,
			endAngle * degreesToRadians
		);
		context.closePath();

		if (wheelState !== WHEEL_STATE.STOPPED || isDragging) {
			context.fillStyle = color;
			context.strokeStyle = 'white';
		} else if (isWinner) {
			context.fillStyle = color;
			context.strokeStyle = color;
		} else {
			context.fillStyle = modifyBrightness(getGrayscaleColor(color), 0.4);
			context.strokeStyle = modifyBrightness(getGrayscaleColor(color), 0.4);
		}

		context.fill();
		context.lineWidth = 2;
		context.stroke();
	}

	function drawChart(chartData: IPieItem[]) {
		if (!context) return;

		context.clearRect(0, 0, radius, radius);

		for (const { id, color, startAngle, endAngle, title, contrastColor } of chartData) {
			drawPieSlice(startAngle, endAngle, color, winner?.id === id);
			drawPieSliceText(title, contrastColor, startAngle, endAngle);
		}
	}

	function getWinner(
		angle: number,
		targetPie: IPieItem[] = [...pie].sort((a, b) => a.startAngle - b.startAngle)
	) {
		let left = 0;
		let right = targetPie.length - 1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			const slice = targetPie[mid];

			if (slice.startAngle <= angle && slice.endAngle >= angle) {
				winner = slice;
				break;
			} else if (slice.startAngle > angle) {
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}
	}

	function onResize() {
		const resizeHeight = resizeElement.clientHeight;
		radius = resizeHeight / 2 - offset * 2;

		setTimeout(() => drawChart(pie), 1);

		wheelWidth = wheelElement.getBoundingClientRect().width;
		wheelHeight = wheelElement.getBoundingClientRect().height;
		wheelX = wheelElement.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheelElement.getBoundingClientRect().y + wheelHeight / 2;
	}

	function onRelease() {
		if (!isDragging) return;

		isDragging = false;
		wheel.angle.set(draggingAngle);
	}

	function onMove(x: number, y: number) {
		if (!isDragging) return;

		const deltaAngle = calculateAngle(x, y) - draggingStartAngle;

		draggingAngle = deltaAngle + $angle;
	}

	function onGrab(x: number, y: number) {
		if (wheelState === WHEEL_STATE.SPINNING) return;

		onResize();

		winner = null;
		isDragging = true;
		draggingStartAngle = calculateAngle(x, y);
		wheel.state.set(WHEEL_STATE.IDLE);
	}

	function calculateAngle(currentX: number, currentY: number) {
		let xLength = currentX - wheelX;
		let yLength = currentY - wheelY;
		let angle = Math.atan2(xLength, yLength) * radiansToDegrees;

		return 360 - angle;
	}
</script>

<svelte:window
	on:mousemove={(e) => onMove(e.clientX, e.clientY)}
	on:mouseup={onRelease}
	on:resize={onResize}
/>

<div
	style="
		display: contents;
		--wheel-h: {width - offset / 2}px;
		--wheel-w: {width - offset / 2}px;
	"
>
	<div
		bind:this={resizeElement}
		style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"
	>
		<div class="wheel">
			{#if winner !== null}
				{@const title = `${winner.title} (${winner.percent}%)`}

				<div class="winner" transition:fade={{ duration: 200 }}>
					{#if winner.isUrl}
						<a href={winner.title} target="_blank">
							{title}
						</a>
					{:else}
						<span>
							{title}
						</span>
					{/if}
					{#if winner.donators.length > 0}
						<div class="winner-donators">
							Заказавшие: {winner.donators.join(', ')}
						</div>
					{/if}
				</div>
			{/if}
			<svg id="pointer" viewBox="0 10 20 60">
				<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="buttonface" />
			</svg>
			<div
				style="--wheel-rotation: {canvasRotation}deg; --wheel-outline: {winner?.color}"
				class="wheel-canvas-wrapper"
				class:disabled={wheelState === WHEEL_STATE.SPINNING || wheelState === WHEEL_STATE.DELAYED}
				aria-hidden
				bind:this={wheelElement}
				on:mousedown={(e) => onGrab(e.clientX, e.clientY)}
			>
				<canvas bind:this={canvas} width={width + offset} height={width + offset} />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.winner {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 3;
		width: 90%;
		padding: 10px;
		translate: -50% -50%;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		/* white-space: nowrap; */
		text-overflow: ellipsis;
		color: white;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: hidden;

		& a {
			color: var(--primary-70);
		}

		&-donators {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px;
			font-size: 20px;
			text-transform: none;
		}
	}
	#pointer {
		position: absolute;
		left: 50%;
		z-index: 2;
		transform: translateX(-50%);
		height: 60px;
		pointer-events: none;
		filter: drop-shadow(0px 2px 2px black);
	}
	.wheel {
		position: relative;
		display: flex;

		&-canvas-wrapper {
			display: flex;
			transform: rotate(var(--wheel-rotation, 0)) translateZ(0);
			cursor: grab;

			&.disabled {
				pointer-events: none;

				&:active {
					cursor: default;
				}
			}

			& canvas {
				rotate: -90deg;
			}

			&:active {
				cursor: grabbing;
			}

			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				translate: -50% -50%;
				width: var(--wheel-w, 100%);
				height: var(--wheel-h, 100%);
				border-radius: 50%;
				box-shadow: 0 2px 10px 10px black;
				outline: 10px solid var(--wheel-outline, buttonface);
				transition: outline 0.2s linear;
				animation: pulse 0.5s ease-out alternate infinite;
				pointer-events: none;
			}
		}
	}
</style>
