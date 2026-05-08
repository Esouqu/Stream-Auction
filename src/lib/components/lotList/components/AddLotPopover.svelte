<script lang="ts">
	import ListAddIcon from '$lib/components/icons/ListAddIcon.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { cn, formatCurrencyNumber } from '$lib/utils';

	const { lots } = getAppManagerContext();

	let lotTitle = $state('');
	let lotValue: number | null = $state(null);
	let open = $state(false);
	const isValid = $derived(!!lotTitle && lotValue !== null);

	function clearInputs() {
		lotTitle = '';
		lotValue = null;
	}

	function addNewLot() {
		if (!lotTitle || lotValue === null) return;

		lots.add(lotTitle, lotValue);

		open = false;
	}
</script>

<Popover bind:open onOpenChangeComplete={clearInputs}>
	<Tooltip>
		<TooltipTrigger>
			{#snippet child({ props })}
				<PopoverTrigger {...props} class={cn(buttonVariants(), 'size-14')}>
					<ListAddIcon class="size-6" />
				</PopoverTrigger>
			{/snippet}
		</TooltipTrigger>
		<TooltipContent>
			Новый лот
			<div><span class="text-muted-foreground">Всего лотов —</span> {lots.items?.length || 0}</div>
			<div>
				<span class="text-muted-foreground">Общая сумма —</span>
				{formatCurrencyNumber(lots.totalValue)}
			</div>
		</TooltipContent>
	</Tooltip>
	<PopoverContent
		class="pointer-events-auto w-min space-y-3 p-3"
		sideOffset={16}
		onCloseAutoFocus={(e) => e.preventDefault()}
	>
		<h3 class="text-lg leading-none font-medium tracking-tight">Новый лот</h3>
		<div class="flex flex-wrap justify-center gap-2">
			<Input
				id="new-lot-title"
				type="text"
				placeholder="Название"
				class="w-[248px]"
				onenter={addNewLot}
				bind:value={lotTitle}
			/>
			<Input
				id="new-lot-value"
				type="number"
				placeholder="Сумма"
				class="w-32"
				onenter={addNewLot}
				bind:value={lotValue}
			/>
			<Button class="w-auto" disabled={!isValid} onclick={addNewLot}>Добавить</Button>
		</div>
	</PopoverContent>
</Popover>
