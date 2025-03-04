<script lang="ts">
	import LotList from '$lib/components/lotList/LotList.svelte';
	import WheelActionBar from '$lib/components/wheel/components/WheelActionBar.svelte';
	import Wheel from '$lib/components/wheel/Wheel.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	const app = getAppManagerContext();
	const { wheel } = app;
</script>

<div class="flex w-full">
	<LotList isCompact />
	<div class="mx-4 flex w-full flex-col">
		<Wheel patternImage={wheel.pattern} />
		<WheelActionBar />
	</div>
</div>
