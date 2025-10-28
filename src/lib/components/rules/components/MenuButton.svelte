<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import type { Icon as IconType } from '@lucide/svelte';

	interface Props {
		Icon: typeof IconType;
		tooltip?: string;
		pressed?: boolean;
		class?: string;
		onclick: () => void;
	}

	const { Icon, tooltip, pressed, onclick }: Props = $props();
</script>

{#if tooltip}
	<Tooltip>
		<TooltipTrigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					class="hover:bg-white/10 data-[pressed=false]:text-muted-foreground data-[pressed=true]:text-primary"
					data-pressed={pressed}
					{onclick}
				>
					<Icon />
				</Button>
			{/snippet}
		</TooltipTrigger>
		<TooltipContent side="bottom">
			{tooltip}
		</TooltipContent>
	</Tooltip>
{:else}
	<Button
		variant="ghost"
		size="icon"
		class="hover:bg-white/10 data-[pressed=false]:text-muted-foreground data-[pressed=true]:text-primary"
		data-pressed={pressed}
		{onclick}
	>
		<Icon />
	</Button>
{/if}
