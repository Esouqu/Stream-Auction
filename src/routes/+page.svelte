<script lang="ts">
	import LotList from '$lib/components/lotList/LotList.svelte';
	import Rules from '$lib/components/rules/Rules.svelte';
</script>

<div class="flex w-full">
	<Rules />
	<div class="mx-4 flex w-full">
		<LotList isCompact={false} />
	</div>
</div>
