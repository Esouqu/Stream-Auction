<script lang="ts">
	import { radiansToDegrees } from '$lib/constants';
	import type { IDonationData, ILot, IPieItem } from '$lib/interfaces';
	import { createPie } from '$lib/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Input from './Input.svelte';
	import donations from '$lib/stores/donations';
	import { addWheelSpinTimeOnDonation, stopWheelOnDonation } from '$lib/stores/settings';
	import lots from '$lib/stores/lots';

	export let items: IPieItem[] = [];
	export let winner: number | null = null;

	const radius = 350;
	const width = radius * 2;
	const offset = 50;
	const maxSpeed = 5;
	const accelerationTime = 0.2;
	const slowDownTime = 0.5;
	const generalTime = accelerationTime + slowDownTime;
	const decelerationTime = 0.3;
	const degreeCapForTextDisplay = Number(((400 / 100) * 1.75).toFixed(2));

	let spinDuration = '10';
	let wheelStartAngle = 0;
	let currentAngle = 0;
	let oldAngle = 0;
	let speed = 0;
	let animationId: number;
	let spinStartTime: number;
	let spinStartDateTime: number;
	let isSpinning = false;
	let isDragging = false;
	let wheel: SVGElement;
	let wheelWidth: number;
	let wheelHeight: number;
	let wheelX: number;
	let wheelY: number;

	$: pie = createPie(items, radius);
	$: spinDurationInMs = +spinDuration * 1000;
	$: handleLots($lots);
	$: handleDonation($donations);

	onMount(() => {
		onResize();

		return () => cancelAnimationFrame(animationId);
	});

	function onResize() {
		wheelWidth = wheel.getBoundingClientRect().width;
		wheelHeight = wheel.getBoundingClientRect().height;
		wheelX = wheel.getBoundingClientRect().x + wheelWidth / 2;
		wheelY = wheel.getBoundingClientRect().y + wheelHeight / 2;
	}

	function getWinner() {
		const normalizedAngle = Math.abs(oldAngle % 360);
		const isClockwiseRotation = oldAngle >= 0;
		const angle = isClockwiseRotation ? 360 - normalizedAngle : normalizedAngle;

		pie.forEach((slice, idx) => {
			if (slice.startAngle <= angle && slice.endAngle >= angle) {
				winner = idx;
			}
		});
	}

	function giveMoment(currentTime: number) {
		if (!spinStartTime) spinStartTime = currentTime;

		if (spinDurationInMs !== +spinDuration * 1000) {
			spinDurationInMs = +spinDuration * 1000;
		}

		const elapsedTime = currentTime - spinStartTime;
		const progress = Math.min(elapsedTime / spinDurationInMs, 1);

		if (!isSpinning) {
			spinStartTime = 0;

			return;
		}

		if (progress >= 1) {
			isSpinning = false;
			spinStartTime = 0;

			return;
		} else if (progress <= accelerationTime) {
			speed = maxSpeed * (progress / accelerationTime);
		} else if (progress > accelerationTime && progress <= generalTime) {
			const slowdownProgress = (progress - accelerationTime) / slowDownTime;
			speed = maxSpeed - slowdownProgress * (maxSpeed - 1);
		} else {
			const slowdownProgress =
				(elapsedTime - spinDurationInMs * generalTime) / (spinDurationInMs * decelerationTime);
			speed = 1 * (1 - slowdownProgress);
		}

		oldAngle += speed;
		getWinner();
		animationId = requestAnimationFrame(giveMoment);
	}

	function spin() {
		if (isSpinning || Number(spinDuration) < 1) return;

		spinStartDateTime = new Date(Date.now()).getTime();
		winner = null;
		isSpinning = true;
		speed = maxSpeed;
		oldAngle = Math.floor(Math.random() * 360);

		requestAnimationFrame(giveMoment);
	}

	function handleLots(_lots: ILot[]) {
		if (!isSpinning || !$addWheelSpinTimeOnDonation.isToggled) return;

		const addDonationTime = $addWheelSpinTimeOnDonation.value;

		lots.onNewItem(() => {
			spinDuration = String(+spinDuration + +addDonationTime);
		});
	}

	function handleDonation(_donations: IDonationData[]) {
		if (!isSpinning || !$stopWheelOnDonation.isToggled) return;

		donations.onNewDonation((donationCreateTime, donationValue) => {
			const isDonationSendAfter = donationCreateTime > spinStartDateTime;
			const isDonationValueEnough = donationValue > Number($stopWheelOnDonation.value);

			if (!isDonationValueEnough || !isDonationSendAfter) {
				isSpinning = false;
			}
		});
	}

	function onRelease() {
		if (!isDragging) return;

		isDragging = false;
		oldAngle = currentAngle;
	}

	function onMove(x: number, y: number) {
		if (!isDragging) return;

		const deltaAngle = calculateAngle(x, y) - wheelStartAngle;

		currentAngle = deltaAngle + oldAngle;
	}

	function onGrab(x: number, y: number) {
		if (isSpinning) return;

		winner = null;
		isDragging = true;
		wheelStartAngle = calculateAngle(x, y);
	}

	function calculateAngle(currentX: number, currentY: number) {
		let xLength = currentX - wheelX;
		let yLength = currentY - wheelY;
		let angle = Math.atan2(xLength, yLength) * radiansToDegrees;

		return 360 - angle; // was 365
	}
</script>

<svelte:window on:resize={onResize} />

<div class="wheel">
	{#if !isSpinning}
		<div class="time-input" transition:fade>
			<Input
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
		class:disabled={isSpinning}
		disabled={isSpinning}
		on:click={() => spin()}
	>
		Крутить
	</button>
	{#if winner !== null}
		<div class="winner" transition:fade>
			{pie[winner].title} ({pie[winner].percent}%)
		</div>
	{/if}
	<svg viewBox="0 10 20 60" id="pointer">
		<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="buttonface" />
	</svg>
	<svg
		class="wheel__svg"
		bind:this={wheel}
		on:mousedown={(e) => onGrab(e.clientX, e.clientY)}
		on:mousemove={(e) => onMove(e.clientX, e.clientY)}
		on:mouseup={onRelease}
		aria-hidden
		{width}
		height={width}
		viewBox="-{offset / 2} -{offset / 2} {width + offset} {width + offset}"
		style="--wheel-rot: {isDragging ? currentAngle : oldAngle}deg"
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
							class:selected={isSpinning || winner === null || winner === idx}
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
					<path id="textPath-{idx}" d="M {middlePoint.x} {middlePoint.y} L {radius} {radius}" />
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
		flex: 1 1 0;

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

			&.disabled {
				box-shadow: inset 0 2px 10px black;
				background-color: white;
				font-size: 0;
			}
		}
		&__svg {
			rotate: var(--wheel-rot, 0);
			border-radius: 50%;
			/* will-change: rotate; */
			user-select: none;
		}

		&-slices {
			outline: 6px solid white;
			border-radius: 100%;
		}

		&__slice {
			/* transition: 1s; */

			&:not(.selected) {
				filter: grayscale(1) opacity(0.3);
				stroke: transparent;
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
