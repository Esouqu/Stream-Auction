<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		isHeader?: boolean;
		isDisabled?: boolean;
		children?: Snippet;
	}

	let { title, description = '', isHeader = false, isDisabled = false, children }: Props = $props();
</script>

<div
	class="grid grid-cols-[auto_14rem] gap-6 data-[disabled='true']:pointer-events-none data-[header='true']:flex data-[header='true']:w-full data-[header='true']:gap-4 data-[disabled='true']:opacity-50"
	data-header={isHeader}
	data-disabled={isDisabled}
>
	<div class="flex w-full flex-col justify-center space-y-1">
		<span
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{title}
		</span>
		{#if description}
			<span class="whitespace-break-spaces text-xs font-normal leading-snug text-muted-foreground">
				{@html description}
			</span>
		{/if}
	</div>
	{@render children?.()}
</div>
