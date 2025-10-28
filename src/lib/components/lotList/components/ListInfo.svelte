<script>
	import SummaryIcon from '$lib/components/icons/SummaryIcon.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { cn } from '$lib/utils';

	const { lots } = getAppManagerContext();
</script>

<Tooltip>
	<TooltipTrigger
		class={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'cursor-default rounded-full')}
	>
		<SummaryIcon />
	</TooltipTrigger>
	<TooltipContent>
		<div>Всего лотов — {lots.items?.length || 0}</div>
		<div class="relative flex h-full items-center gap-1">
			<div>Общая сумма —</div>
			<div>{lots.totalValue}</div>
		</div>
	</TooltipContent>
</Tooltip>
