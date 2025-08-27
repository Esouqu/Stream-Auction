<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isExtended?: boolean;
		children: Snippet;
	}

	const { isExtended, children }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	{#if isExtended || isExtended === undefined}
		<div class="flex flex-col gap-4">
			{@render children()}
		</div>
	{/if}
</div>
