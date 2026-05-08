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
		<div class="w-[9rem] shrink-0 px-4 pr-14 text-end">Сумма</div>
		<div class="w-[56px] shrink-0"></div>
	</div>

	{#if !lots.sortedItems}
		<div class="flex h-full flex-col space-y-1">
			{#each { length: 17 } as _, idx (idx)}
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
			class="pointer-events-none absolute right-4 bottom-4 left-4 z-50 mx-auto flex w-fit flex-col gap-2"
		>
			<BlurPanel class="pointer-events-auto flex items-center overflow-hidden px-0 py-0">
				<Search bind:value={searchValue} bind:isInputVisible={isSearchInputVisible} />
				{#if !isSearchInputVisible}
					<div
						class="flex items-center gap-2 pr-1.5 pl-12"
						transition:slide={{ axis: 'x', duration: 400 }}
					>
						<TitleViewButton bind:isDonatorsShown />
						<AddLotPopover />
						<LotLoader />
						<ClearActionDialog />
					</div>
				{/if}
			</BlurPanel>
		</div>
	{/if}
</div>
