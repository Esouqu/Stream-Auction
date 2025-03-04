<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isExtended?: boolean;
		header: Snippet;
		content: Snippet;
	}

	const { isExtended, header, content }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="text-lg font-medium leading-none">
		{@render header()}
	</div>
	{#if isExtended || isExtended === undefined}
		<div class="flex flex-col gap-4">
			{@render content()}
		</div>
	{/if}
</div>
