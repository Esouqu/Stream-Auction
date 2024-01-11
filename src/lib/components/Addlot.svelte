<script lang="ts">
	import lots from '$lib/stores/lots';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import NumberInput from './NumberInput.svelte';

	let text: string;
	let value: number;

	function addItem() {
		if (!text || !value) return;

		lots.add(text, value);

		text = '';
		value = 0;
	}
</script>

<div class="add-lot">
	<div style="display: flex;">
		<Input
			--input-w="300px"
			type="text"
			id="add-lot-text"
			placeholder="Название лота"
			bind:value={text}
			onEnter={addItem}
		/>
		<NumberInput
			--input-w="100px"
			--input-text-al="center"
			id="add-lot-value"
			placeholder="Сумма"
			onEnter={addItem}
			bind:value
		/>
	</div>
	<Button icon="listAddItem" on:click={addItem} />
</div>

<style lang="scss">
	.add-lot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
