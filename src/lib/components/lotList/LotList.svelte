<script lang="ts">
	import { getPercentFromTotal } from '$lib/utils';
	import { Skeleton } from '../ui/skeleton';
	import Lot from './components/Lot.svelte';
	import VirtualList from './components/VirtualList.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import AddLotPopover from './components/AddLotPopover.svelte';
	import Search from './components/Search.svelte';
	import TitleViewButton from './components/TitleViewButton.svelte';
	import ClearActionDialog from './components/ClearActionDialog.svelte';
	import ListInfo from './components/ListInfo.svelte';
	import LotLoader from './components/LotLoader.svelte';
	import BlurPanel from '../BlurPanel.svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		compact?: boolean;
	}

	const { compact = false }: Props = $props();

	const { lots } = getAppManagerContext();

	let searchValue = $state('');
	let isDonatorsShown = $state(false);
	let isSearchInputVisible = $state(false);

	const filteredLots = $derived(lots.searchItems(searchValue));
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-card/40">
	<div class="flex w-full shrink-0 py-2 font-medium text-muted-foreground">
		<div class="w-14 shrink-0 px-4 pl-4 text-center">ID</div>
		<div class="w-full px-4">Название</div>
		<div class="w-[8rem] shrink-0 px-4 pr-2 text-end">Сумма</div>
		<div class="w-[56px] shrink-0"></div>
	</div>

	{#if !lots.sortedItems}
		<div class="flex h-full flex-col space-y-1">
			{#each { length: 17 } as _}
				<Skeleton class="h-10 w-full" />
			{/each}
		</div>
	{:else}
		<VirtualList items={filteredLots || lots.sortedItems} isPadded={!compact}>
			{#snippet children(lot)}
				{@const percent = getPercentFromTotal(lot.value, lots.totalValue || 0)}
				<Lot {...lot} {percent} {isDonatorsShown} />
			{/snippet}
			{#snippet empty()}
				<div class="text-lg font-medium text-muted-foreground">Список пуст</div>
			{/snippet}
		</VirtualList>
	{/if}

	{#if !compact}
		<div
			class="pointer-events-none absolute bottom-0 left-0 z-50 flex w-full items-center justify-between p-4 font-medium"
		>
			<AddLotPopover />
			<BlurPanel class="pointer-events-auto flex px-0 py-0">
				<Search bind:value={searchValue} bind:isInputVisible={isSearchInputVisible} />
				{#if !isSearchInputVisible}
					<div class="flex py-1.5 pr-1.5 pl-10" transition:slide={{ axis: 'x', duration: 400 }}>
						<TitleViewButton bind:isDonatorsShown />
						<LotLoader />
						<ClearActionDialog />
						<ListInfo />
					</div>
				{/if}
			</BlurPanel>
		</div>
	{/if}
</div>
