<script lang="ts">
	import gsap from 'gsap';
	import { fade, fly, scale } from 'svelte/transition';

	interface Props {
		trigger?: number;
	}

	let { trigger }: Props = $props();

	let ref: SVGSVGElement | null = $state(null);

	$effect(() => {
		if (trigger) {
			animate();
		}
	});

	function animate() {
		if (!ref) return;

		gsap.killTweensOf(ref);
		gsap.killTweensOf(ref);
		gsap
			.timeline({ defaults: { ease: 'power1.inOut' } })
			.fromTo(ref, { translateY: -10 }, { translateY: 0, duration: 0.2 });
	}
</script>

<svg
	class="pointer-events-auto absolute top-[-2.5rem] right-0 left-0 z-20 mx-auto h-[4rem] drop-shadow-[0_2px_2px_black]"
	viewBox="0 10 20 60"
	bind:this={ref}
	in:fade
>
	<path d="M 3 20 Q 10 0 17 20 Q 10 100 3 20" fill="white" />
</svg>
