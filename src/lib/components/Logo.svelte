<script lang="ts">
	import logoPng from '$lib/assets/logo.png';
	import { Button } from './ui/button';
</script>

<Button
	class="group absolute -top-16 h-max w-max scale-[0.3] bg-transparent p-0 transition-all duration-200 outline-none select-none hover:bg-transparent active:scale-[0.3] active:bg-transparent"
	href="/"
>
	<div
		class="absolute h-full w-full animate-tilt bg-center bg-no-repeat transition-[scale] duration-500 group-hover:scale-110"
		style="background-image: url('{logoPng}');"
	></div>
	<img
		class="w-full object-contain p-12 backdrop-blur-lg backdrop-saturate-[3]"
		src={logoPng}
		alt="logo"
	/>
</Button>
