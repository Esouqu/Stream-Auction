<script lang="ts">
	import logoPng from '$lib/assets/logo.png';
	import gsap from 'gsap';
	import { Button } from './ui/button';
	import { onMount } from 'svelte';
	import { radiansToDegrees } from '$lib/constants';

	let ref: HTMLImageElement | null = $state(null);

	// onMount(() => {
	// 	gsap.set(ref, {
	// 		rotate: 0
	// 	});
	// });

	// function onmousemove(e: MouseEvent) {
	// 	if (!ref) return;

	// 	const { left, top, width, height } = ref.getBoundingClientRect();
	// 	const centerX = left + width / 2;
	// 	const centerY = top + height / 2;
	// 	const rotation = Math.atan2(e.clientY - centerY, e.clientX - centerX);

	// 	ref.style.rotate = `${rotation * radiansToDegrees - 90}deg`;
	// }

	// function onmousedown() {
	// 	gsap.to(ref, {
	// 		scale: 1.2,
	// 		// rotate: 0,
	// 		duration: 0.1,
	// 		ease: 'circ.out'
	// 	});
	// }
	// function onmouseup() {
	// 	gsap.to(ref, {
	// 		scale: 1,
	// 		// rotate: 0,
	// 		duration: 0.1,
	// 		ease: 'circ.in'
	// 	});
	// }
</script>

<!-- <svelte:window {onmousemove} {onmouseup} {onmousedown} /> -->

<Button class="w-10 select-none p-2" href="/" variant="link">
	<img
		class="w-full object-contain"
		style="transform: scale(1, 1); rotate: 0deg;"
		src={logoPng}
		alt="logo"
		bind:this={ref}
	/>
</Button>
