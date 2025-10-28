<script lang="ts">
	import LotList from '$lib/components/lotList/LotList.svelte';
	import Wheel from '$lib/components/wheel/Wheel.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { MediaQuery } from 'svelte/reactivity';

	const app = getAppManagerContext();
	const { wheel } = app;

	const large = new MediaQuery('(min-width: 1536px)');
</script>

<div class="flex w-full">
	{#if large.current}
		<div class="h-full w-full max-w-[26rem] overflow-hidden">
			<LotList compact />
		</div>
	{/if}
	<div class="mx-4 flex w-full flex-col">
		<Wheel patternImage={wheel.pattern} />
	</div>
</div>
