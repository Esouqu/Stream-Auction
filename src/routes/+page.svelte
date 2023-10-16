<script lang="ts">
	import Lot from '$lib/components/Lot.svelte';
	import Input from '$lib/components/Input.svelte';
	import lots from '$lib/stores/lots';
	import Button from '$lib/components/Button.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { getTotal } from '$lib/utils';
	import Popup from '$lib/components/Popup.svelte';

	let newLotText: string;
	let newLotValue: string;

	function addItemOrValue() {
		if (!newLotText || !newLotValue) return;
		const lot = $lots.find(({ title }) => title.toLowerCase() === newLotText.toLowerCase());

		if (lot) {
			lots.addValue(lot.id, Number(newLotValue));
		} else {
			lots.addItem(newLotText, Number(newLotValue));
		}

		newLotText = '';
		newLotValue = '';
	}

	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
</script>

<svelte:head>
	<title>Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div class="add-lot">
		<Input
			--input-w="300px"
			type="text"
			id="add-lot-text"
			placeholder="Название лота"
			bind:value={newLotText}
			callback={addItemOrValue}
		/>
		<Input
			--input-w="100px"
			--input-text-al="center"
			type="number"
			id="add-lot-value"
			placeholder="Сумма"
			bind:value={newLotValue}
			callback={addItemOrValue}
		/>
		<Button icon="listAddItem" on:click={addItemOrValue} />
	</div>

	{#if $lots.length > 0}
		<ol class="lots-list">
			{#each sortedLots as lot (lot.id)}
				{@const percent = (lot.value / getTotal($lots.map((item) => item.value))) * 100}

				<li animate:flip={{ duration: 200 }} transition:fly={{ duration: 200 }}>
					<Lot {...lot} value={String(lot.value)} {percent} />
				</li>
			{/each}
		</ol>
	{:else}
		<div class="no-lots" transition:fade>
			<p>Лоты отсутствуют</p>
		</div>
	{/if}
</section>

<style lang="scss">
	.auction-section {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.lots-list {
		display: flex;
		flex-direction: column;
		flex: 1 1 0;
		gap: 10px;
		padding: 0 30px;
		margin: 0;
		color: white;
		list-style-type: none;
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
	.add-lot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 30px;
	}
	.no-lots {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 30px;
		height: 100%;
		font-size: 24px;
	}
</style>
