<script lang="ts">
	import penguinSpritesheet from '$lib/assets/penguin_spritesheet_64x64.png';
	import { onMount } from 'svelte';
	import gsap, { SteppedEase } from 'gsap';
	import penguinFrames from '$lib/misc/penguinFrames';

	interface Props {}

	const {}: Props = $props();

	let penguinRef: HTMLDivElement | null = $state(null);
	let currentAnimation = $state(penguinFrames[0]);
	let scaleX = $state(1);

	let intervalId: NodeJS.Timeout;

	onMount(() => {
		return () => clearInterval(intervalId);
	});

	$effect(() => {
		playCurrentAnimation();
	});

	function playCurrentAnimation() {
		if (!penguinRef) return;

		intervalId = setInterval(() => {
			randomizeDirection();
			playAnimation();
			changeAnimation();
		}, 4900);
	}

	function playAnimation() {
		const { x, y, frames, width } = currentAnimation;

		gsap.fromTo(
			penguinRef,
			{ backgroundPosition: `${-x}px ${-y}px` },
			{
				backgroundPosition: `${-x + -width * (frames - 1)}px ${-y}px`,
				repeat: -1,
				duration: 0.7,
				ease: SteppedEase.config(frames - 1)
			}
		);
	}

	function randomizeDirection() {
		scaleX = Math.random() > 0.5 ? 1 : -1;
	}

	function changeAnimation() {
		const randomIndex = Math.floor(Math.random() * penguinFrames.length);
		currentAnimation = penguinFrames[randomIndex];
	}
</script>

<div
	class="h-16 w-16 scale-[2.5] overflow-hidden"
	class:scale-x-[-2.5]={scaleX < 0}
	style="background-image: url({penguinSpritesheet}); background-position: -192px 0px; transform: scale3d(${scaleX},2, 2);"
	bind:this={penguinRef}
></div>
