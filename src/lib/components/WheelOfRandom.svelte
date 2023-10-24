<script lang="ts">
	import { createPie, getRandomInRange, isUrl } from '$lib/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Input from './Input.svelte';
	import lots from '$lib/stores/lots';
	import wheel from '$lib/stores/wheel';
	import timer from '$lib/stores/timer';
	import type { IPieItem } from '$lib/interfaces';
	import { radiansToDegrees } from '$lib/constants';
	import TextButton from './TextButton.svelte';
	import winnerSound from '$lib/assets/sounds/winner_sound.wav';

	const radius = 360;
	const width = radius * 2;
	const offset = 50;
	const degreeCapForTextDisplay = Number(((400 / 100) * 1.75).toFixed(2));
	// const wheelWinnerCelebrationSound = new Audio(winnerSound);

	let draggingAngle = 0;
	let draggingStartAngle = 0;
	let isDragging = false;
	let isSettingsShown = true;
	let winner: IPieItem | null = null;
	let spinDuration = '10';
	let minSpinDuration = '100';
	let maxSpinDuration = '250';
	let wheelElement: SVGElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;

	$: pie = createPie($lots, radius);
	$: getWinner($wheel.normalizedAngle);

	onMount(() => onResize());

	function onResize() {
		wheelWidth = wheelElement.getBoundingClientRect().width;
		wheelHeight = wheelElement.getBoundingClientRect().height;
		wheelX = wheelElement.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheelElement.getBoundingClientRect().y + wheelHeight / 2;
	}

	// function playCelebrationSound() {
	// 	wheelWinnerCelebrationSound.volume = 0.3;
	// 	wheelWinnerCelebrationSound.play();
	// }

	function getWinner(angle: number) {
		// if (!$wheel.isSpinning) return;

		pie.forEach((slice) => {
			if (slice.startAngle <= angle && slice.endAngle >= angle) {
				winner = slice;
			}
		});

		if (!$wheel.isSpinning) {
			// playCelebrationSound();
		}
	}

	function handleWheelSpin() {
		const secondsToSpin = Number(spinDuration) * 1000;

		isSettingsShown = false;

		timer.reset();
		timer.setTime(secondsToSpin);
		timer.start();
		wheel.spin(secondsToSpin);
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
		if ($wheel.isSpinning) return;

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

<svelte:window
	on:resize={onResize}
	on:mousemove={(e) => onMove(e.clientX, e.clientY)}
	on:mouseup={onRelease}
/>

<div
	class="wheel"
	style="
    --wheel-outline: {winner?.color};
    --wheel-h: {width - offset - 10}px; --wheel-w: {width - offset - 10}px;
    --wheel-rot: {isDragging ? draggingAngle : $wheel.angle}deg;
  "
>
	{#if winner !== null}
		<div class="winner" transition:fade={{ duration: 200 }}>
			{#if isUrl(winner.title)}
				<a href={winner.title} target="_blank" style="color: var(--color-orange);">
					{winner.title} ({winner.percent}%)
				</a>
				{#if !$wheel.isSpinning && winner.donators.length > 1}
					<div class="winner-donators">
						Заказавшие: {winner.donators.join(', ')}
					</div>
				{/if}
			{:else}
				<span>
					{winner.title} ({winner.percent}%)
				</span>
				{#if !$wheel.isSpinning && winner.donators.length > 1}
					<div class="winner-donators">
						Заказавшие: {winner.donators.join(', ')}
					</div>
				{/if}
			{/if}
		</div>
	{/if}
	{#if isSettingsShown && !$wheel.isSpinning}
		<div class="wheel-settings-wrapper" transition:fade={{ duration: 200 }}>
			{#if !$wheel.isSpinning}
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
					<div
						class="interactables-wrapper"
						style="display: flex; gap: 5px; flex-direction: column;"
					>
						<div>
							<TextButton
								text="Ролл"
								color="orange"
								on:click={handleWheelSpin}
								isDisabled={$lots.length < 1}
							/>
							<TextButton
								text="Удалить Лот"
								color="red"
								on:click={handleLotDeletion}
								isDisabled={winner === null}
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if !$wheel.isSpinning && !isDragging}
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
	<svg
		class="wheel__svg"
		bind:this={wheelElement}
		{width}
		height={width}
		viewBox="-{offset / 2} -{offset / 2} {width + offset} {width + offset}"
		pointer-events="none"
		on:mousedown={(e) => onGrab(e.clientX, e.clientY)}
		aria-hidden
	>
		<g pointer-events="fill">
			<!-- Slices -->
			<g class="wheel-slices">
				{#each pie as { id, startPoint, endPoint, isCircle, largeArcFlag, color }, idx}
					{#if isCircle}
						<circle cx={radius} cy={radius} r={radius} fill={color} stroke={color} />
					{:else}
						<path
							id="{idx}slice"
							class="wheel__slice"
							class:selected={$wheel.isSpinning || winner === null || winner.id === id}
							d="M {startPoint.x} {startPoint.y} A {radius} {radius} 0 {largeArcFlag} 1 {endPoint.x} {endPoint.y} L {radius} {radius} Z"
							fill={color}
							stroke="white"
							stroke-width="2px"
						/>
					{/if}
				{/each}
			</g>

			<!-- Paths for slice text -->
			<defs>
				{#each pie as { middlePoint }, idx}
					<path
						id="textPath-{idx}"
						d="M {middlePoint.x} {middlePoint.y} L {radius} {radius}"
						style="user-select: none;"
					/>
				{/each}
			</defs>

			<!-- Slice text -->
			<g>
				{#each pie as { shortTitle, startAngle, endAngle }, idx}
					{@const isBigEnough = endAngle - startAngle > degreeCapForTextDisplay}

					<text class="wheel__title">
						<textPath xlink:href="#textPath-{idx}" startOffset={offset}>
							<tspan class:shown={isBigEnough} alignment-baseline="middle">
								{shortTitle}
							</tspan>
						</textPath>
					</text>
				{/each}
			</g>
		</g>
	</svg>
	<div class="wheel__background" />
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
		color: white;
		background-color: rgba(0, 0, 0, 0.5);

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
			width: calc(var(--wheel-w) + 30px);
			height: calc(var(--wheel-h) + 30px);
		}

		&__background {
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: 1;
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
		&__svg {
			position: relative;
			z-index: 1;
			rotate: var(--wheel-rot, 0);
			border-radius: 50%;
			user-select: none;
		}

		&__slice {
			transition: fill 0.2s linear;

			&:not(.selected) {
				stroke: transparent;
				filter: grayscale(1) brightness(0.4);
			}
		}

		&__title {
			height: 7px;
			font-size: 20px;
			font-weight: 600;
			font-family: sans-serif;
			letter-spacing: 0;
			user-select: none;

			& tspan {
				fill: black;

				&:not(.shown) {
					font-size: 0;
				}
			}
		}
	}
	@keyframes pulse {
		0% {
			outline-width: 0;
		}
		100% {
			outline-width: 10px;
		}
	}
</style>
