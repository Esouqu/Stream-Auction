<script lang="ts">
	import lots from '$lib/stores/lots';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	let text: string;
	let value: string;

	function addItem() {
		if (!text || !value) return;

		lots.add(text, Number(value));

		text = '';
		value = '';
	}
</script>

<div class="add-lot">
	<Input
		--input-w="300px"
		type="text"
		id="add-lot-text"
		placeholder="Название лота"
		bind:value={text}
		onEnter={addItem}
	/>
	<Input
		--input-w="100px"
		--input-text-al="center"
		type="number"
		id="add-lot-value"
		placeholder="Сумма"
		bind:value
		onEnter={addItem}
	/>
	<Button icon="listAddItem" on:click={addItem} />
</div>

<style lang="scss">
	.add-lot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 0px;
	}
</style>
