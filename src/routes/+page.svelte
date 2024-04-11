<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import VirtualList from '$lib/components/VirtualList.svelte';
	import Button from '$lib/components/Button.svelte';
	import ActionPanel from '$lib/components/ActionPanel.svelte';
	import { getTotal } from '$lib/utils';
	import Input from '$lib/components/Input.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import tooltip from '$lib/actions/tooltip';
	import Lot from '$lib/components/Lot.svelte';

	let text: string;
	let value: number;
	let searchText: string = '';
	let isSearching = false;
	let isAddingLot = false;
	let titleInputElement: HTMLInputElement;
	let searchLotInputElement: HTMLInputElement;

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
	<title>Лоты - Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div class="virtual-list-wrapper">
		<div class="list-headers">
			<h4 style="min-width: 60px; margin-right: 10px; text-align: center;">ID</h4>
			<h4 style="width: 100%; padding: 0 10.5px;">Название</h4>
			<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Сумма</h4>
			<h4 style="min-width: 90px; padding: 0 10.5px; text-align: center;">Процент</h4>
			<h4 style="margin-right: 10px; min-width: 81px; text-align: center; ">Действия</h4>
		</div>

		<VirtualList lots={sortedLots} let:item>
			{@const percent = (item.value / total) * 100}
			{@const { position, donators, contrastColor, ...rest } = item}

			<Lot {...rest} {percent} />
		</VirtualList>

		{#if $lots.length < 1}
			<div class="no-lots" transition:fade>
				<p>Лоты отсутствуют</p>
			</div>
		{/if}
	</div>

	<div style="position: absolute; right: 20px; top: 25px; z-index: 999; display: flex; gap: 5px;">
		{#if isAddingLot}
			<div style="display: flex;" transition:slide={{ axis: 'x', duration: 200 }}>
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
			<div style="display: flex;" transition:slide={{ axis: 'x', duration: 200 }}>
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
				icon="listAddItem"
				iconColor={isAddingLot ? 'white' : 'black'}
				color={isAddingLot ? 'var(--primary-50)' : 'white'}
				isFilled={true}
				title="Добавить лот"
				on:click={addItem}
			/>
		</div>

		<div use:tooltip={{ content: 'Поиск' }}>
			<Button
				icon="search"
				iconColor={isSearching ? 'white' : 'black'}
				color={isSearching ? 'var(--primary-50)' : 'white'}
				isFilled={true}
				isDisabled={$lots.length < 1}
				on:click={search}
			/>
		</div>

		{#key $lots}
			<div use:tooltip={{ content: `Удалить все лоты (${$lots.length})` }}>
				<Button
					icon="trashcanSweep"
					iconColor="white"
					color="var(--error)"
					isFilled={true}
					isDisabled={$lots.length < 1}
					on:click={() => lots.removeAll()}
				/>
			</div>
		{/key}

		{#key total}
			<div use:tooltip={{ content: `Общая сумма (${total})` }}>
				<Button icon="ruble" iconColor="white" isInteractive={false} />
			</div>
		{/key}
	</div>
</section>

<style lang="scss">
	.virtual-list-wrapper {
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
