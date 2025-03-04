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
	<div class="flex h-full min-w-[29rem]">
		<Rules />
	</div>
	<div class="mx-4 flex w-full">
		<LotList isCompact={false} />
	</div>
</div>
