<script>
	import { buttonVariants } from '$lib/components/ui/button';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import InfoIcon from '@lucide/svelte/icons/info';

	const { lots } = getAppManagerContext();
</script>

<Tooltip>
	<TooltipTrigger
		class={[
			buttonVariants({ size: 'icon', variant: 'ghost' }),
			'!cursor-default text-muted-foreground hover:bg-transparent hover:text-foreground active:bg-transparent active:outline-transparent'
		]}
	>
		<InfoIcon />
	</TooltipTrigger>
	<TooltipContent>
		<div>Всего лотов — {lots.items?.length || 0}</div>
		<div class="relative flex h-full items-center gap-1">
			<div>Общая сумма —</div>
			<div>{lots.totalValue}</div>
		</div>
	</TooltipContent>
</Tooltip>
