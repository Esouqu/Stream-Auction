<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
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
	<CardContent class="flex flex-col overflow-hidden p-0">
		<div class="p-4">{@render header()}</div>

		{#if content}
			{#if isExtended || isExtended === undefined}
				<Separator />
				<div class="flex flex-col gap-4 p-4" transition:slide>
					{@render content()}
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>
