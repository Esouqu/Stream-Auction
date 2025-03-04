<script lang="ts">
	import { Table, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { getPercentFromTotal } from '$lib/utils';
	import { Skeleton } from '../ui/skeleton';
	import Lot from './components/Lot.svelte';
	import VirtualList from './components/VirtualList.svelte';
	import PlusIcon from 'lucide-svelte/icons/list-plus';
	import SearchIcon from 'lucide-svelte/icons/search';
	import ZoomInIcon from 'lucide-svelte/icons/zoom-in';
	import ZoomOutIcon from 'lucide-svelte/icons/zoom-out';
	import { slide } from 'svelte/transition';
	import Input from '$lib/components/Input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Toggle } from '$lib/components/ui/toggle';
	import TotalValue from './components/TotalValue.svelte';
	import ClearActionDialog from './components/ClearActionDialog.svelte';
	import LotLoader from './components/LotLoader.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import Penguin from '../Penguin.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import ScrollArea from '../ui/scroll-area/scroll-area.svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		isCompact: boolean;
	}

	const { isCompact = false }: Props = $props();

	const { lots, background } = getAppManagerContext();
	const minItemHeight = 2.5;
	const maxItemHeight = 3;
	const slideBarStyle = 'absolute bottom-[100%] left-0 z-50 flex w-full border-t p-4 bg-card';

	let isNewLotInputVisible = $state(false);
	let isSearchVisible = $state(false);
	let lotTitle = $state('');
	let lotValue: number | null = $state(null);
	let lotDonator = $state('');
	let isValid = $derived(!!lotTitle && lotValue !== null);
	let searchText = $state('');
	let filteredLots = $derived(lots.searchItems(searchText));

	let searchInputRef: HTMLInputElement | null = $state(null);
	let newLotTitleRef: HTMLInputElement | null = $state(null);

	// PERFORMANCE PROBLEM
	let searchTimeout: NodeJS.Timeout;
	let newLotTimeout: NodeJS.Timeout;

	$effect(() => {
		if (isSearchVisible) {
			isNewLotInputVisible = false;

			clearTimeouts();
			searchTimeout = setTimeout(() => searchInputRef?.focus(), 200);
		} else {
			searchText = '';
		}
	});

	$effect(() => {
		if (newLotTimeout) clearTimeout(newLotTimeout);
		if (isNewLotInputVisible) {
			isSearchVisible = false;

			clearTimeouts();
			newLotTimeout = setTimeout(() => newLotTitleRef?.focus(), 200);
		} else {
			clearNewLotInputs();
		}
	});

	function clearTimeouts() {
		clearTimeout(searchTimeout);
		clearTimeout(newLotTimeout);
	}
	// PERFORMANCE PROBLEM

	function clearNewLotInputs() {
		lotTitle = '';
		lotValue = null;
		lotDonator = '';
	}

	function addNewLot() {
		if (!lotTitle || lotValue === null) return;

		lots.add(lotTitle, lotValue, [lotDonator]);

		clearNewLotInputs();
	}

	function onZoomOut() {
		lots.settings.itemHeightRem = Math.max(minItemHeight, lots.settings.itemHeightRem - 0.2);
	}

	function onZoomIn() {
		lots.settings.itemHeightRem = Math.min(maxItemHeight, lots.settings.itemHeightRem + 0.2);
	}
</script>

<div
	class="flex h-full w-full flex-col overflow-hidden rounded-md border bg-card data-[compact=true]:max-w-[29rem]"
	data-compact={isCompact}
	style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
>
	<Table>
		<TableHeader
			class="sticky top-0 z-50 w-full border-b bg-secondary"
			style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
		>
			<TableRow>
				<TableHead class="w-14 pl-4">ID</TableHead>
				<TableHead class="px-3">Название</TableHead>
				<TableHead class="w-[8rem] pr-4 text-end">Сумма</TableHead>
				<TableHead class="w-[3.25rem]"></TableHead>
			</TableRow>
		</TableHeader>
	</Table>

	{#if !lots.sortedItems}
		<div class="flex h-full flex-col space-y-1">
			{#each { length: 17 } as _}
				<Skeleton class="w-full" style="height: {lots.settings.itemHeightRem}rem;" />
			{/each}
		</div>
	{:else}
		<!-- <ScrollArea>
			{#each filteredLots || lots.sortedItems as lot (lot.id)}
				{@const percent = getPercentFromTotal(lot.value, lots.totalValue || 0)}
				<div animate:flip={{ duration: 300 }}>
					<Lot {...lot} {percent} itemHeight={lots.settings.itemHeightRem} />
				</div>
			{/each}
		</ScrollArea> -->
		<VirtualList items={filteredLots || lots.sortedItems} itemSize={lots.settings.itemHeightRem}>
			{#snippet children(lot)}
				{@const percent = getPercentFromTotal(lot.value, lots.totalValue || 0)}
				<Lot {...lot} {percent} itemHeight={lots.settings.itemHeightRem} />
			{/snippet}
			{#snippet empty()}
				<Penguin />
			{/snippet}
		</VirtualList>
	{/if}

	<div
		class="relative flex items-center justify-between border-t bg-secondary px-4 py-2 text-sm font-medium"
		style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
	>
		<div
			class="flex min-h-10 items-center gap-4 text-muted-foreground data-[compact=true]:mx-auto"
			data-compact={isCompact}
		>
			<div>Всего лотов — {lots.items?.length || 0}</div>
			<TotalValue />
		</div>

		{#if !isCompact}
			<div class="flex">
				<Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Toggle {...props} bind:pressed={isNewLotInputVisible}>
								<PlusIcon />
							</Toggle>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent>Новый лот</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Toggle {...props} bind:pressed={isSearchVisible}>
								<SearchIcon />
							</Toggle>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent>Поиск</TooltipContent>
				</Tooltip>

				<Separator orientation="vertical" class="mx-2" />

				<!-- <Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								onclick={onZoomIn}
								disabled={lots.settings.itemHeightRem >= maxItemHeight}
							>
								<ZoomInIcon />
							</Button>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent>Увеличить</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								onclick={onZoomOut}
								disabled={lots.settings.itemHeightRem <= minItemHeight}
							>
								<ZoomOutIcon />
							</Button>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent>Уменьшить</TooltipContent>
				</Tooltip> -->

				<LotLoader />
				<ClearActionDialog />
			</div>
		{/if}

		{#if isSearchVisible}
			<div class={slideBarStyle} transition:slide={{ duration: 200 }}>
				<Input
					id="search"
					type="text"
					class="mx-auto w-1/3"
					placeholder="Поиск"
					bind:value={searchText}
					bind:ref={searchInputRef}
				/>
			</div>
		{:else if isNewLotInputVisible}
			<div class={slideBarStyle} transition:slide={{ duration: 200 }}>
				<div class="grid grid-cols-8 gap-4">
					<div class="col-span-3 flex flex-col gap-2">
						<Input
							id="new-lot-title"
							type="text"
							placeholder="Название *"
							onConfirmation={addNewLot}
							bind:value={lotTitle}
							bind:ref={newLotTitleRef}
						/>
					</div>
					<div class="col-span-2 flex flex-col gap-2">
						<Input
							id="new-lot-value"
							type="number"
							placeholder="Сумма *"
							onConfirmation={addNewLot}
							bind:value={lotValue}
						/>
					</div>
					<div class="col-span-2 flex flex-col gap-2">
						<Input
							id="new-lot-donator"
							type="text"
							placeholder="Никнейм"
							onConfirmation={addNewLot}
							bind:value={lotDonator}
						/>
					</div>
					<Button onclick={addNewLot} disabled={!isValid}>Добавить</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
