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
	class="grid grid-cols-[auto_14rem] gap-6 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[header=true]:flex data-[header=true]:w-full data-[header=true]:gap-4"
	data-header={isHeader}
	data-disabled={isDisabled}
>
	<div class="flex w-full flex-col justify-center space-y-1">
		<span class="leading-none font-medium">
			{title}
		</span>
		{#if description}
			<span class="text-sm leading-[18px] whitespace-break-spaces text-muted-foreground">
				{@html description}
			</span>
		{/if}
	</div>
	{@render children?.()}
</div>
