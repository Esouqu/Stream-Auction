<script lang="ts">
	import lots from '$lib/stores/lots';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import donations from '$lib/stores/donations';

	export let id: number;
	export let title: string;
	export let value: string;
	export let donators: string[];
	export let percent: number;
	export let color: string;

	let isHovered = false;
	let valueToAdd: string;

	function addValue() {
		if (!valueToAdd) return;

		lots.addValue(id, Number(valueToAdd));
		valueToAdd = '';
	}

	function handleDrop(e: DragEvent) {
		const data = e.dataTransfer?.getData('application/json');
		if (!data || !isValidData(e)) return;

		const donation = JSON.parse(data);

		lots.addValue(id, donation.value, donation.username);
		donations.remove(donation.id);
		e.dataTransfer?.clearData();
		isHovered = false;
	}

	function handleDragOver(e: DragEvent) {
		if (isValidData(e)) isHovered = true;
	}

	function handleDragLeave(e: DragEvent) {
		if (isValidData(e)) isHovered = false;
	}

	function isValidData(e: DragEvent) {
		const data = e.dataTransfer;
		if (!data) return false;

		return data.types.includes('application/json');
	}
</script>

{#key value}
	<div
		class="lot"
		class:hovered={isHovered}
		data-lot-id="#{id}"
		on:dragover|preventDefault={(e) => handleDragOver(e)}
		on:dragleave|preventDefault={(e) => handleDragLeave(e)}
		on:drop|preventDefault={(e) => handleDrop(e)}
		aria-hidden
	>
		<Input
			--input-w-w="100%"
			id="lot-text-{id}"
			type="text"
			placeholder="Название лота"
			onEnter={() => lots.setTitle(id, title)}
			onInput={() => lots.setTitle(id, title)}
			onBlur={() => lots.setTitle(id, title)}
			bind:value={title}
		/>
		<Input
			--input-w="100px"
			--input-text-al="center"
			id="lot-value-{id}"
			type="number"
			placeholder="Сумма"
			onEnter={() => lots.setValue(id, Number(value))}
			onBlur={() => lots.setValue(id, Number(value))}
			isPreventInput={true}
			bind:value
		/>
		<Button icon="plus" on:click={addValue} />
		<Input
			--input-w="100px"
			--input-text-al="center"
			id="lot-add-value-{id}"
			type="number"
			placeholder="Сумма"
			onEnter={addValue}
			bind:value={valueToAdd}
		/>
		<div class="lot__percent">{Number(percent.toFixed(1))}%</div>
		<div class="lot-buttons-wrapper">
			<Button icon="listRemoveItem" on:click={() => lots.remove(id)} />
		</div>
	</div>
{/key}

<style lang="scss">
	.lot {
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 10px;
		animation: blink 1s ease-in-out forwards;

		&::before {
			content: attr(data-lot-id);
			display: flex;
			align-items: center;
			justify-content: end;
			border-radius: 10px;
			min-width: 30px;
			height: 30px;
			font-weight: bold;
		}

		&-buttons-wrapper {
			position: relative;
			display: flex;
		}

		&__percent {
			text-align: center;
			min-width: 60px;
			font-variant-numeric: tabular-nums;
		}

		&.hovered {
			outline: 2px solid white;
		}
	}

	@keyframes blink {
		0% {
			scale: 1;
			background-color: transparent;
		}
		30% {
			scale: 1.025;
			background-color: var(--color-purple);
		}
		100% {
			scale: 1;
			background-color: transparent;
		}
	}
</style>
