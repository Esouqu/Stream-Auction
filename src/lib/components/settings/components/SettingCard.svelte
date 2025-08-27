<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		isExtended?: boolean;
		header: Snippet;
		content?: Snippet;
	}

	const { isExtended, header, content }: Props = $props();
</script>

<Card>
	<CardContent class="flex flex-col">
		<div>{@render header()}</div>

		{#if content}
			{#if isExtended || isExtended === undefined}
				<div class="mt-4 flex flex-col gap-4" transition:slide>
					{@render content()}
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>
