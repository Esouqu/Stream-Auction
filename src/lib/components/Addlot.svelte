<script lang="ts">
	import lots from '$lib/stores/lots';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

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
</script>

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

<style lang="scss">
	.add-lot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 30px;
	}
</style>
