<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import VirtualList from '$lib/components/VirtualList.svelte';
	import Button from '$lib/components/Button.svelte';
	import { getTotal } from '$lib/utils';
	import Input from '$lib/components/Input.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import tooltip from '$lib/actions/tooltip';
	import Lot from '$lib/components/Lot.svelte';
	import settings from '$lib/stores/settings';
	import listAddIcon from '$lib/assets/list_add_icon.svg';
	import listAddIconBlack from '$lib/assets/list_add_icon_black.svg';
	import searchIcon from '$lib/assets/search_icon.svg';
	import searchIconBlack from '$lib/assets/search_icon_black.svg';
	import trashcanIconBlack from '$lib/assets/trashcan_sweep_icon_black.svg';
	import rubleIcon from '$lib/assets/currency_ruble_icon.svg';
	import Spinner from '$lib/components/Spinner.svelte';

	let text: string;
	let value: number;
	let searchText: string = '';
	let isSearching = false;
	let isAddingLot = false;
	let titleInputElement: HTMLInputElement;
	let searchLotInputElement: HTMLInputElement;

	$: autoScroll = settings.autoScroll;
	$: isLotsLoading = lots.isLoading;
	$: sortedLots = [...$lots]
		.sort((a, b) => b.value - a.value)
		.filter((l) => l.title.toLowerCase().includes(searchText.toLowerCase()));
	$: total = getTotal($lots.map((l) => l.value));
	$: {
		if (!isSearching) {
			searchText = '';
		}
	}

	function search() {
		if (!isSearching) {
			isSearching = true;
			isAddingLot = false;
			setTimeout(() => searchLotInputElement.focus(), 100);
			return;
		}

		isSearching = false;
	}

	function addItem() {
		if (!isAddingLot) {
			isAddingLot = true;
			isSearching = false;
			setTimeout(() => titleInputElement.focus(), 100);
			return;
		}

		if (!text || !value) {
			isAddingLot = false;
			return;
		}

		lots.add(text, value);

		text = '';
		value = 0;
		isAddingLot = false;
	}
</script>

<svelte:head>
	<title>Вклиновый Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div class="list-wrapper">
		<div class="list-headers">
			<h4 style="min-width: 60px; margin-right: 10px; text-align: center;">ID</h4>
			<h4 style="width: 100%; padding: 0 10.5px;">Название</h4>
			<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Сумма</h4>
			<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Процент</h4>
			<h4 style="margin-right: 10px; min-width: 81px; text-align: center; ">Действия</h4>
		</div>

		<VirtualList
			lots={sortedLots}
			isAutoScrollEnabled={$autoScroll.isAuctionListEnabled}
			autoScrollSpeed={$autoScroll.speed}
			let:item
		>
			{@const { donators, contrastColor, url, position, ...rest } = item}

			<Lot {...rest} />
		</VirtualList>

		{#if $lots.length < 1}
			<div class="no-lots" transition:fade>
				{#if $isLotsLoading}
					<Spinner --spinner-size="35px" />
				{:else}
					<p>Варианты отсутствуют</p>
				{/if}
			</div>
		{/if}
	</div>

	<div style="position: absolute; right: 20px; top: 25px; z-index: 999; display: flex; gap: 5px;">
		{#if isAddingLot}
			<div
				style="display: flex; position: absolute; bottom: -60px; right: 0;"
				transition:fly={{ y: -20, duration: 200 }}
			>
				<Input
					--input-w="300px"
					type="text"
					id="add-lot-text"
					placeholder="Название лота"
					isFilled={true}
					onEnter={addItem}
					bind:element={titleInputElement}
					bind:value={text}
				/>
				<NumberInput
					--input-w="100px"
					--input-text-al="center"
					id="add-lot-value"
					placeholder="Сумма"
					onEnter={addItem}
					isFilled={true}
					bind:value
				/>
			</div>
		{/if}
		{#if isSearching}
			<div
				style="position: absolute; bottom: -60px; right: 0;"
				transition:fly={{ y: -20, duration: 200 }}
			>
				<Input
					--input-w="300px"
					type="text"
					id="search-text"
					placeholder="Название лота"
					isFilled={true}
					bind:element={searchLotInputElement}
					bind:value={searchText}
				/>
			</div>
		{/if}
		<div use:tooltip={{ content: 'Добавить лот' }}>
			<Button
				icon={isAddingLot ? listAddIcon : listAddIconBlack}
				color={isAddingLot ? 'active' : 'default'}
				on:click={addItem}
			/>
		</div>

		<div use:tooltip={{ content: 'Поиск' }}>
			<Button
				icon={isSearching ? searchIcon : searchIconBlack}
				color={isSearching ? 'active' : 'default'}
				isDisabled={$lots.length < 1}
				on:click={search}
			/>
		</div>

		{#key $lots}
			<div use:tooltip={{ content: `Удалить все лоты (${$lots.length})` }}>
				<Button
					icon={trashcanIconBlack}
					isDisabled={$lots.length < 1}
					on:click={() => lots.removeAll()}
				/>
			</div>
		{/key}

		{#key total}
			<div use:tooltip={{ content: `Общая сумма (${total})` }}>
				<Button icon={rubleIcon} color="transparent" isInteractive={false} />
			</div>
		{/key}
	</div>
</section>

<style lang="scss">
	.list-wrapper {
		position: relative;
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		overflow: hidden;
	}
	.auction-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		border-bottom: 3px solid var(--primary-50);
		width: 100%;
	}
	.no-lots {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1 1 0;
		width: 100%;
		height: 100%;
		font-size: 24px;
	}
	.list-headers {
		display: flex;
		padding: 0 6px 0 0;
		border-radius: 10px 10px 0 0;
		background-color: var(--primary-50);

		& h4 {
			margin: 10px 0;
			letter-spacing: 0.5px;
		}
	}
</style>
