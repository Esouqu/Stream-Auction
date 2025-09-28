<script lang="ts">
	import LotList from '$lib/components/lotList/LotList.svelte';
	import Rules from '$lib/components/rules/Rules.svelte';
</script>

<!--
<ResizablePaneGroup class="mr-4 w-full" direction="horizontal" autoSaveId="lotListAndRules">
	<ResizablePane class="flex w-full" defaultSize={35}>
		<Rules />
	</ResizablePane>
	<ResizableHandle class="mx-2" withHandle />
	<ResizablePane defaultSize={65} minSize={40}>
		<LotList isCompact={false} />
	</ResizablePane>
</ResizablePaneGroup> -->

<div class="flex w-full">
	<div class="hidden h-full w-full max-w-[26rem] 2xl:flex">
		<Rules />
	</div>
	<div class="mr-4 flex w-full 2xl:mx-4">
		<LotList />
	</div>
</div>
