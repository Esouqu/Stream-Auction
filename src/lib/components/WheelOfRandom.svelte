<script lang="ts">
	import { createPie } from '$lib/utils';
	import { onMount } from 'svelte';
	import { draw, fade } from 'svelte/transition';
	import Input from './Input.svelte';
	import donations from '$lib/stores/donations';
	import { addWheelSpinTimeOnDonation, stopWheelOnDonation } from '$lib/stores/settings';
	import lots from '$lib/stores/lots';
	import wheel from '$lib/stores/wheel';
	import timer from '$lib/stores/timer';

	const radius = 360;
	const width = radius * 2;
	const offset = 50;
	const degreeCapForTextDisplay = Number(((400 / 100) * 1.75).toFixed(2));

	let winner: number | null = null;
	let spinDuration = '10';
	let spinStartDateTime: number;
	let isSpinning = false;
	let wheelElement: SVGElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;

	let isInitialLoad = true;

	$: pie = createPie($lots, radius);
	$: $lots, handleLots();
	$: $donations, handleDonation();
	$: getWinner($wheel.normalizedAngle);

	onMount(() => onResize());

	function onResize() {
		wheelWidth = wheelElement.getBoundingClientRect().width;
		wheelHeight = wheelElement.getBoundingClientRect().height;
		wheelX = wheelElement.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheelElement.getBoundingClientRect().y + wheelHeight / 2;
	}

	function getWinner(angle: number) {
		if (!$wheel.isSpinning) return;

		pie.forEach((slice, idx) => {
			if (slice.startAngle <= angle && slice.endAngle >= angle) {
				winner = idx;
			}
		});
	}

	function handleWheelSpin() {
		const secondsToSpin = Number(spinDuration) * 1000;
		timer.reset();
		timer.setTime(secondsToSpin);
		timer.start();
		wheel.spin(secondsToSpin);
	}

	function handleLots() {
		if (!$wheel.isSpinning || !$addWheelSpinTimeOnDonation.isToggled) return;
		if (isInitialLoad) {
			isInitialLoad = false;
			return;
		}

		const addDonationTime = $addWheelSpinTimeOnDonation.value;

		timer.add(Number(addDonationTime) * 1000);
		wheel.addSpinDuration(Number(addDonationTime) * 1000);
	}

	function handleDonation() {
		if (!isSpinning || !$stopWheelOnDonation.isToggled) return;

		donations.onNewDonation(({ createTime, amount_in_user_currency }) => {
			const isDonationSendAfter = createTime > spinStartDateTime;
			const isDonationValueEnough = amount_in_user_currency > Number($stopWheelOnDonation.value);

			if (!isDonationValueEnough || !isDonationSendAfter) {
				isSpinning = false;
			}
		});
	}

	// function onRelease() {
	// 	if (!isDragging) return;

	// 	isDragging = false;
	// 	oldAngle = currentAngle;
	// }

	// function onMove(x: number, y: number) {
	// 	if (!isDragging) return;

	// 	const deltaAngle = calculateAngle(x, y) - wheelStartAngle;

	// 	currentAngle = deltaAngle + oldAngle;
	// }

	// function onGrab(x: number, y: number) {
	// 	if (isSpinning) return;

	// 	winner = null;
	// 	isDragging = true;
	// 	wheelStartAngle = calculateAngle(x, y);
	// }

	// function calculateAngle(currentX: number, currentY: number) {
	// 	let xLength = currentX - wheelX;
	// 	let yLength = currentY - wheelY;
	// 	let angle = Math.atan2(xLength, yLength) * radiansToDegrees;

	// 	return 360 - angle;
	// }
</script>

<svelte:window on:resize={onResize} />

<div class="wheel">
	<div class="wheel-settings-wrapper">
		{#if !isSpinning}
			<div class="time-input" transition:fade>
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
		{/if}
		<button
			class="wheel__button"
			class:disabled={$wheel.isSpinning}
			disabled={$wheel.isSpinning}
			on:click={handleWheelSpin}
		>
			Крутить
		</button>
		{#if winner !== null}
			<div class="winner" transition:fade>
				{pie[winner].title} ({pie[winner].percent}%)
			</div>
		{/if}
	</div>
	<svg viewBox="0 10 20 60" id="pointer">
		<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="buttonface" />
	</svg>
	<svg
		class="wheel__svg"
		bind:this={wheelElement}
		aria-hidden
		{width}
		height={width}
		viewBox="-{offset / 2} -{offset / 2} {width + offset} {width + offset}"
		style="--wheel-rot: {$wheel.angle}deg"
		pointer-events="none"
	>
		<g pointer-events="fill">
			<!-- Slices -->
			<g class="wheel-slices">
				{#each pie as { startPoint, endPoint, isCircle, largeArcFlag, color }, idx}
					{#if isCircle}
						<circle cx={radius} cy={radius} r={radius} fill={color} stroke={color} />
					{:else}
						<path
							id="{idx}slice"
							class="wheel__slice"
							class:selected={$wheel.isSpinning || winner === null || winner === idx}
							d="M {startPoint.x} {startPoint.y} A {radius} {radius} 0 {largeArcFlag} 1 {endPoint.x} {endPoint.y} L {radius} {radius} Z"
							fill={color}
							stroke={color}
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
</div>

<style lang="scss">
	.time-input {
		position: absolute;
		z-index: 2;
		top: calc(50% - 70px);
		left: 50%;
		translate: -50% -50%;
	}
	.winner {
		position: absolute;
		top: calc(50% - 20px);
		left: 50%;
		z-index: 2;
		width: 90%;
		padding: 10px 0;
		translate: -50%;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		color: white;
		background-color: rgba(0, 0, 0, 0.5);
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

		/* &-settings-wrapper {
			position: absolute;
			z-index: 3;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: buttonface;
		} */
		&__button {
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 50%;
			translate: -50% -50%;
			width: 100px;
			height: 100px;
			border: 0;
			border-radius: 50%;
			font-weight: 700;
			font-size: 18px;
			text-transform: uppercase;
			transition: 0.2s;
			user-select: none;

			&.disabled {
				box-shadow: inset 0 2px 10px black;
				background-color: white;
				font-size: 0;
			}
		}
		&__svg {
			rotate: var(--wheel-rot, 0);
			border-radius: 50%;
			user-select: none;
		}

		&-slices {
			outline: 6px solid white;
			border-radius: 100%;
		}

		&__slice {
			transition: fill 0.5s linear, stroke 0.5s linear;

			&:not(.selected) {
				stroke: transparent;
				filter: grayscale(1) opacity(0.3);
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
</style>
