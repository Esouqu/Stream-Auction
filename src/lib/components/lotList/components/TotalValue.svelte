<script lang="ts">
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { formatNumberWithSuffix } from '$lib/utils';

	const { lots } = getAppManagerContext();
</script>

<Tooltip>
	<TooltipTrigger
		onclick={() => (lots.settings.isTotalValueHidden = !lots.settings.isTotalValueHidden)}
	>
		<div class="relative flex h-full items-center gap-1">
			<div>Общая сумма —</div>
			<div class="relative">
				{formatNumberWithSuffix(lots.totalValue)}
				<div
					class="absolute left-0 top-0 z-50 h-full w-full rounded bg-muted transition-opacity"
					class:opacity-0={!lots.settings.isTotalValueHidden}
				></div>
			</div>
		</div>
	</TooltipTrigger>
	<TooltipContent>{lots.totalValue}</TooltipContent>
</Tooltip>
