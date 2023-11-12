<script lang="ts">
	import {
		fireConfetti,
		getGrayscaleColor,
		getPercentFromTotal,
		getRandomInRange,
		getShortenedText,
		getTotal,
		isUrl,
		modifyBrightness,
		toRadians
	} from '$lib/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Input from './Input.svelte';
	import lots from '$lib/stores/lots';
	import wheel, { WHEEL_STATE } from '$lib/stores/wheel';
	import timer from '$lib/stores/timer';
	import type { ILot, IPieItem } from '$lib/interfaces';
	import { radiansToDegrees } from '$lib/constants';
	import TextButton from './TextButton.svelte';
	import winnerSound from '$lib/assets/sounds/winner_sound.wav';
	import wheelSectionSound from '$lib/assets/sounds/wheel_section_sound.wav';

	const radius = 360;
	const width = radius * 2;
	const offset = 20;
	const offsetCenter = radius + offset / 2;
	const degreeCapForTextDisplay = Number(((400 / 100) * 3).toFixed(2));
	const maxTitleLength = Number(((radius / 100) * 5.75).toFixed(2));

	const celebrationSound = new Audio(winnerSound);
	celebrationSound.preload;
	celebrationSound.volume = 0.2;

	// const spinSound = new Audio(wheelSectionSound);
	// spinSound.preload;
	// spinSound.volume = 0.2;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let draggingAngle = 0;
	let draggingStartAngle = 0;
	let isDragging = false;
	let isSettingsShown = true;
	let winner: IPieItem | null = null;
	let spinDuration = '10';
	let minSpinDuration = '150';
	let maxSpinDuration = '250';
	let wheelElement: HTMLElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;

	$: pie = createPie($lots);
	$: wheelState = wheel.state;
	$: $wheelState, getWinner($wheel.normalizedAngle);
	$: isDragging, $wheelState, drawChart(pie);

	onMount(() => {
		context = canvas.getContext('2d');

		drawChart(pie);
		onResize();
	});

	function onResize() {
		wheelWidth = wheelElement.getBoundingClientRect().width;
		wheelHeight = wheelElement.getBoundingClientRect().height;
		wheelX = wheelElement.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheelElement.getBoundingClientRect().y + wheelHeight / 2;
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

			startAngle = idx && endAngle;
			endAngle = !idx ? deg : startAngle + deg;

			return {
				...item,
				percent: getPercentFromTotal(item.value, total),
				startAngle,
				endAngle
			};
		});
	}

	function drawChart(chartData: IPieItem[]) {
		if (!context) return;

		context.clearRect(0, 0, radius, radius);

		for (const { id, color, startAngle, endAngle } of chartData) {
			context.beginPath();
			context.moveTo(offsetCenter, offsetCenter);
			context.arc(offsetCenter, offsetCenter, radius, toRadians(startAngle), toRadians(endAngle));
			context.closePath();

			if (winner?.id === id || $wheelState !== WHEEL_STATE.WINNING || isDragging) {
				context.fillStyle = color;
				context.strokeStyle = $wheelState === WHEEL_STATE.SPINNING || isDragging ? 'white' : color;
			} else {
				context.strokeStyle = modifyBrightness(getGrayscaleColor(color), 0.4);
				context.fillStyle = modifyBrightness(getGrayscaleColor(color), 0.4);
			}

			context.fill();
			context.lineWidth = 2;
			context.stroke();
		}

		context.fillStyle = 'black';
		context.font = '700 20px sans-serif';
		context.textBaseline = 'middle';
		context.textAlign = 'start';

		for (const { title, startAngle, endAngle } of chartData) {
			const isBigEnough = endAngle - startAngle > degreeCapForTextDisplay;

			if (!isBigEnough) continue;

			const shortTitle = getShortenedText(title, maxTitleLength);
			const textAngle = (startAngle + endAngle) / 2; // Find the middle angle of the slice
			const textX = offsetCenter + offsetCenter * 0.8 * Math.cos(toRadians(textAngle)); // Move the title towards the center
			const textY = offsetCenter + offsetCenter * 0.8 * Math.sin(toRadians(textAngle)); // Move the title towards the center

			context.save(); // Save the current canvas state
			context.translate(textX, textY); // Move the canvas origin to the text position
			context.rotate(toRadians(textAngle + 180)); // Rotate the canvas by textAngle - 90 degrees
			context.fillText(shortTitle, 0, 0);
			context.restore(); // Restore the canvas state to remove the translation and rotation
		}

		if ($wheelState === WHEEL_STATE.WINNING) {
			celebrate();
			wheel.setState(WHEEL_STATE.WAITING);
		}
	}

	function getWinner(angle: number) {
		if ($wheelState === WHEEL_STATE.WAITING) return;

		for (const slice of pie) {
			if (slice.startAngle <= angle && slice.endAngle >= angle) {
				// if (winner?.id !== slice.id) {
				// 	spinSound.load();
				// 	spinSound.play();
				// }

				winner = slice;
			}
		}
	}

	function handleWheelSpin() {
		const secondsToSpin = Number(spinDuration) * 1000;

		isSettingsShown = false;

		timer.reset();
		timer.setTime(secondsToSpin);
		timer.start();
		wheel.spin(secondsToSpin);
		drawChart(pie);
	}

	function handleLotDeletion() {
		if (!winner) return;

		lots.remove(winner.id);
		winner = null;
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

		winner = null;
		isDragging = true;
		draggingStartAngle = calculateAngle(x, y);
	}

	function calculateAngle(currentX: number, currentY: number) {
		let xLength = currentX - wheelX;
		let yLength = currentY - wheelY;
		let angle = Math.atan2(xLength, yLength) * radiansToDegrees;

		return 360 - angle;
	}
</script>

<svelte:window on:mousemove={(e) => onMove(e.clientX, e.clientY)} on:mouseup={onRelease} />

<div
	class="wheel"
	style="
    --wheel-outline: {winner?.color};
    --wheel-h: {width - 10}px; --wheel-w: {width - 10}px;
    --wheel-rot: {isDragging ? draggingAngle : $wheel.angle}deg;
  "
>
	{#if winner !== null}
		<div class="winner" transition:fade={{ duration: 200 }}>
			{#if isUrl(winner.title)}
				<a href={winner.title} target="_blank" style="color: var(--color-orange);">
					{winner.title} ({winner.percent}%)
				</a>
				{#if winner.donators.length > 1}
					<div class="winner-donators">
						Заказавшие: {winner.donators.join(', ')}
					</div>
				{/if}
			{:else}
				<span>
					{winner.title} ({winner.percent}%)
				</span>
				{#if winner.donators.length > 1}
					<div class="winner-donators">
						Заказавшие: {winner.donators.join(', ')}
					</div>
				{/if}
			{/if}
		</div>
	{/if}
	{#if isSettingsShown && $wheelState !== WHEEL_STATE.SPINNING}
		<div class="wheel-settings-wrapper" transition:fade={{ duration: 200 }}>
			<!-- {#if $wheelState !== WHEEL_STATE.SPINNING} -->
			<div
				class="winner-buttons-wrapper"
				class:spaced={winner !== null}
				transition:fade={{ duration: 200 }}
			>
				<div class="interactables-wrapper" style="display: flex; flex-direction: row; gap: 5px;">
					<div style="display: flex; flex-direction: column; gap: 5px;">
						<Input
							--input-fw="700"
							--input-w="100px"
							--input-text-al="center"
							id="spin-min"
							placeholder="Мин"
							type="number"
							bind:value={minSpinDuration}
							colorStyle="white"
						/>
						<Input
							--input-fw="700"
							--input-w="100px"
							--input-text-al="center"
							id="spin-max"
							placeholder="Макс"
							type="number"
							bind:value={maxSpinDuration}
							colorStyle="white"
						/>
					</div>
					<TextButton
						text="Сгенерировать"
						on:click={() =>
							(spinDuration = String(getRandomInRange(minSpinDuration, maxSpinDuration)))}
					/>
					<Input
						--input-fw="700"
						--input-w="100px"
						--input-text-al="center"
						id="spin-time"
						placeholder="Секунды"
						type="number"
						bind:value={spinDuration}
						colorStyle="white"
					/>
				</div>
				<div class="interactables-wrapper" style="display: flex; gap: 5px; flex-direction: column;">
					<div>
						<TextButton
							--text-b-fs="18px"
							text="Ролл"
							color="orange"
							on:click={handleWheelSpin}
							isDisabled={$lots.length < 1}
						/>
						<TextButton
							--text-b-fs="18px"
							text="Удалить Лот"
							color="red"
							on:click={handleLotDeletion}
							isDisabled={winner === null}
						/>
					</div>
				</div>
			</div>
			<!-- {/if} -->
		</div>
	{/if}

	{#if $wheelState !== WHEEL_STATE.SPINNING && !isDragging}
		<div style="position: absolute; bottom: 10%; left: 50%; z-index: 2; translate: -50% -10%;">
			<TextButton
				text={isSettingsShown ? 'Скрыть' : 'Показать'}
				on:click={() => (isSettingsShown = !isSettingsShown)}
			/>
		</div>
	{/if}
	<svg viewBox="0 10 20 60" id="pointer">
		<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="buttonface" />
	</svg>
	<div
		class="wheel-canvas-wrapper"
		style="rotate: {isDragging ? draggingAngle : $wheel.angle}deg;"
		aria-hidden
		on:mousedown={(e) => onGrab(e.clientX, e.clientY)}
		bind:this={wheelElement}
	>
		<canvas bind:this={canvas} width={width + offset} height={width + offset} />
	</div>
</div>

<style lang="scss">
	.winner {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 3;
		width: 90%;
		padding: 10px 0;
		translate: -50% -50%;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		text-overflow: ellipsis;
		color: white;
		background-color: rgba(0, 0, 0, 0.5);
		overflow: hidden;

		&-donators {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px;
			font-size: 20px;
			text-transform: none;
		}
		&-buttons-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 10px;

			& .interactables-wrapper {
				translate: 0;
				transition: translate 0.2s ease-in-out;
			}
			&.spaced {
				& .interactables-wrapper:nth-child(1) {
					translate: 0 -150%;
				}
				& .interactables-wrapper:nth-child(2) {
					translate: 0 150%;
				}
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
			translate: -50% -50%;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			z-index: 2;
			background-color: rgb(20 20 20 / 60%);
			width: calc(var(--wheel-w) + 20px);
			height: calc(var(--wheel-h) + 20px);
		}

		&-canvas-wrapper {
			display: flex;

			& canvas {
				rotate: -90deg;
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
				/* animation: pulse 0.5s ease-out alternate infinite; */
				pointer-events: none;
			}
		}
	}
</style>
