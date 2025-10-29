<script lang="ts">
	import logoPng from '$lib/assets/logo.png';
	import { Button } from './ui/button';
</script>

<Button
	class="group relative size-10 bg-transparent p-0 transition-all duration-250 outline-none select-none hover:bg-transparent active:scale-105 active:bg-transparent"
	href="/"
	draggable="false"
>
	<!-- <div
		class="absolute h-full w-full animate-tilt bg-center bg-no-repeat transition-[scale] duration-500 group-hover:scale-110"
		style="background-image: url('{logoPng}');"
	></div> -->
	<img class="w-full object-contain" src={logoPng} alt="logo" draggable="false" />
	<img
		class="absolute z-[-1] w-full scale-110 animate-tilt blur-[5px] saturate-[3] transition-[scale] duration-500 group-hover:scale-115"
		src={logoPng}
		alt="logo"
		draggable="false"
	/>
</Button>
