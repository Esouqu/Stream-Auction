<script lang="ts">
	import {
		extractUrl,
		fireConfetti,
		getGrayscaleColor,
		getPercentFromTotal,
		getRandomInRange,
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
	import TextButton from './TextButton.svelte';
	import winnerSound from '$lib/assets/sounds/winner_sound.wav';
	import NumberInput from './NumberInput.svelte';
	import { beforeNavigate } from '$app/navigation';
	import storable from '$lib/stores/storable';
	// import wheelSectionSound from '$lib/assets/sounds/wheel_section_sound.wav';

	const radius = 360;
	const width = radius * 2;
	const offset = 20;
	const offsetCenter = radius + offset / 2;
	const degreeCapForTextDisplay = Number(((400 / 100) * 3).toFixed(2));
	const maxTitleLength = Number(((radius / 100) * 5.75).toFixed(2));

	let celebrationSound: HTMLAudioElement;
	// let spinSound = new Audio(wheelSectionSound);

	let spinDuration = 10;
	let minSpinDuration = storable(1, 'minSpinDuration');
	let maxSpinDuration = storable(10, 'maxSpinDuration');
	let isNavigating = false;
	let isDragging = false;
	let isSettingsShown = true;
	let draggingAngle = 0;
	let draggingStartAngle = 0;
	let winner: IPieItem | null = null;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let wheelElement: HTMLElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;

	$: canvasRotation = isDragging && !isNavigating ? draggingAngle : $wheel.angle;
	$: wheelState = wheel.state;
	$: pie = createPie($lots);
	$: $wheelState, isDragging, drawChart(pie);
	$: {
		if (!isNavigating) getWinner($wheel.normalizedAngle);
	}

	beforeNavigate(() => (isNavigating = true));

	onMount(() => {
		context = canvas.getContext('2d');

		loadAudio();
		onResize();
		drawChart(pie);

		return wheel.spinStopped.subscribe(() => {
			const lastPie = createPie($lots);

			isSettingsShown = true;

			drawChart(lastPie);
			getWinner($wheel.normalizedAngle, lastPie);
			celebrate();
		});
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

		if ($wheelState !== WHEEL_STATE.WINNING || isDragging) {
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
		if ($wheelState === WHEEL_STATE.WAITING) return;

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

	function startSpin() {
		isSettingsShown = false;

		drawChart(pie);
		wheel.startSpin(spinDuration * 1000);
	}

	function deleteWinner() {
		if (!winner) return;

		lots.remove(winner.id);
		winner = null;
	}

	function onResize() {
		wheelWidth = wheelElement.getBoundingClientRect().width;
		wheelHeight = wheelElement.getBoundingClientRect().height;
		wheelX = wheelElement.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheelElement.getBoundingClientRect().y + wheelHeight / 2;
	}

	function onRelease() {
		if (!isDragging) return;

		isDragging = false;
		wheel.setAngle(draggingAngle);
	}

	function onMove(x: number, y: number) {
		if (!isDragging) return;

		const deltaAngle = calculateAngle(x, y) - draggingStartAngle;

		draggingAngle = deltaAngle + $wheel.angle;
	}

	function onGrab(x: number, y: number) {
		if ($wheelState === WHEEL_STATE.SPINNING) return;

		onResize();

		winner = null;
		isDragging = true;
		draggingStartAngle = calculateAngle(x, y);
		wheelState.set(WHEEL_STATE.WAITING);
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
		--wheel-h: {width - 10}px;
		--wheel-w: {width - 10}px;
	"
>
	<div class="wheel">
		{#if winner !== null && !isNavigating}
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
		{#if isSettingsShown && $wheelState !== WHEEL_STATE.SPINNING}
			<div class="wheel-settings-wrapper" transition:fade={{ duration: 200 }}>
				<div class="winner-options" class:spaced={winner !== null}>
					<div style="display: flex; flex-direction: row;">
						<NumberInput
							--input-w="90px"
							id="spin-min"
							suffix="Сек"
							label="Минимум"
							isFilled={true}
							bind:value={$minSpinDuration}
						/>
						<NumberInput
							--input-w="90px"
							id="spin-max"
							suffix="Сек"
							label="Максимум"
							isFilled={true}
							bind:value={$maxSpinDuration}
						/>
						<NumberInput
							--input-w="90px"
							id="spin-time"
							suffix="Сек"
							label="Длительность"
							isFilled={true}
							bind:value={spinDuration}
						/>
					</div>
					<TextButton
						text="Сгенерировать"
						on:click={() => (spinDuration = getRandomInRange($minSpinDuration, $maxSpinDuration))}
					/>
					<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
						<TextButton
							text="Ролл"
							color="purple"
							isDisabled={$lots.length < 1}
							on:click={startSpin}
						/>
						<TextButton
							text="Удалить Лот"
							color="red"
							isDisabled={winner === null}
							on:click={deleteWinner}
						/>
					</div>
				</div>
			</div>
		{/if}
		{#if $wheelState !== WHEEL_STATE.SPINNING && !isDragging}
			<div class="hide-button-wrapper">
				<TextButton
					text={isSettingsShown ? 'Скрыть' : 'Показать'}
					on:click={() => (isSettingsShown = !isSettingsShown)}
				/>
			</div>
		{/if}
		<svg id="pointer" viewBox="0 10 20 60">
			<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="buttonface" />
		</svg>
		<div
			style="--wheel-rotation: {canvasRotation}deg; --wheel-outline: {winner?.color}"
			class="wheel-canvas-wrapper"
			class:disabled={$wheelState === WHEEL_STATE.SPINNING}
			aria-hidden
			bind:this={wheelElement}
			on:mousedown={(e) => onGrab(e.clientX, e.clientY)}
		>
			<canvas bind:this={canvas} width={width + offset} height={width + offset} />
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

		&-options {
			display: flex;
			flex-direction: column;
			gap: 10px;
			translate: 0;
			transition: translate 0.2s ease-in-out;

			&.spaced {
				translate: 0 100%;
			}
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

		&-settings-wrapper {
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: 2;
			translate: -50% -50%;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			width: calc(var(--wheel-w) + 20px);
			height: calc(var(--wheel-h) + 20px);
			background-color: rgb(20 20 20 / 60%);
		}

		&-canvas-wrapper {
			display: flex;
			transform: rotate(var(--wheel-rotation, 0)) translateZ(0);
			cursor: grab;

			&.disabled {
				cursor: default;

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

	.hide-button-wrapper {
		position: absolute;
		bottom: 10%;
		left: 50%;
		z-index: 2;
		translate: -50% -10%;
	}
</style>
