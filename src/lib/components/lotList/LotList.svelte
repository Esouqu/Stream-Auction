<script lang="ts">
	import { getPercentFromTotal } from '$lib/utils';
	import { Skeleton } from '../ui/skeleton';
	import Lot from './components/Lot.svelte';
	import VirtualList from './components/VirtualList.svelte';
	import PlusIcon from '@lucide/svelte/icons/list-plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { slide } from 'svelte/transition';
	import Input from '$lib/components/Input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Toggle } from '$lib/components/ui/toggle';
	import ClearActionDialog from './components/ClearActionDialog.svelte';
	import LotLoader from './components/LotLoader.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import ListInfo from './components/ListInfo.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import RepeatIcon from '@lucide/svelte/icons/repeat-2';

	interface Props {
		compact?: boolean;
	}

	const { compact = false }: Props = $props();

	const { lots } = getAppManagerContext();
	const slideBarStyle = 'absolute bottom-full left-0 z-50 flex w-full p-4 bg-elevation-2';

	let isNewLotInputVisible = $state(false);
	let isSearchVisible = $state(false);
	let lotTitle = $state('');
	let lotValue: number | null = $state(null);
	let isValid = $derived(!!lotTitle && lotValue !== null);
	let searchText = $state('');
	let filteredLots = $derived(lots.searchItems(searchText));
	let isDonatorsShown = $state(false);

	let searchInputRef: HTMLInputElement | null = $state(null);
	let newLotTitleRef: HTMLInputElement | null = $state(null);

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

	function clearNewLotInputs() {
		lotTitle = '';
		lotValue = null;
	}

	function addNewLot() {
		if (!lotTitle || lotValue === null) return;

		lots.add(lotTitle, lotValue);

		clearNewLotInputs();
		isNewLotInputVisible = false;
	}
</script>

<div class="flex h-full w-full flex-col overflow-hidden rounded-xl bg-card/40">
	<div class="sticky top-0 z-50 flex w-full shrink-0 py-2 font-medium text-muted-foreground">
		<div class="w-14 px-4 pl-4">ID</div>
		<div class="w-full px-4">Название</div>
		<div class="w-[8rem] px-4 pr-4 text-end">Сумма</div>
		<div class="w-[3.25rem] px-4"></div>
	</div>

	{#if !lots.sortedItems}
		<div class="flex h-full flex-col space-y-1">
			{#each { length: 17 } as _}
				<Skeleton class="h-10 w-full" />
			{/each}
		</div>
	{:else}
		<VirtualList items={filteredLots || lots.sortedItems}>
			{#snippet children(lot)}
				{@const percent = getPercentFromTotal(lot.value, lots.totalValue || 0)}
				<Lot {...lot} {percent} itemHeight={lots.settings.itemHeight} {isDonatorsShown} />
			{/snippet}
			{#snippet empty()}
				<div class="text-lg font-medium text-muted-foreground">Список пуст</div>
			{/snippet}
		</VirtualList>
	{/if}

	{#if !compact}
		<div class="relative flex items-center justify-between p-4 font-medium">
			<div class="flex">
				<Toggle class="p-2" bind:pressed={isNewLotInputVisible}>
					<PlusIcon />
					Добавить
				</Toggle>

				<Toggle class="p-2" bind:pressed={isSearchVisible}>
					<SearchIcon />
					Поиск
				</Toggle>
			</div>

			<div class="flex">
				<Tooltip>
					<TooltipTrigger
						class={buttonVariants({ size: 'icon', variant: 'ghost' })}
						onclick={() => (isDonatorsShown = !isDonatorsShown)}
					>
						<RepeatIcon />
					</TooltipTrigger>
					<TooltipContent>Ники донатеров вместо названия</TooltipContent>
				</Tooltip>

				<LotLoader />
				<ClearActionDialog />
				<ListInfo />
			</div>

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
					<div class="flex w-full justify-center gap-4">
						<div class="col-span-3 flex flex-col gap-2">
							<Input
								id="new-lot-title"
								type="text"
								placeholder="Название"
								onenter={addNewLot}
								bind:value={lotTitle}
								bind:ref={newLotTitleRef}
							/>
						</div>
						<div class="col-span-2 flex flex-col gap-2">
							<Input
								id="new-lot-value"
								type="number"
								placeholder="Сумма"
								onenter={addNewLot}
								bind:value={lotValue}
							/>
						</div>
						<Button onclick={addNewLot} disabled={!isValid}>Добавить</Button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
