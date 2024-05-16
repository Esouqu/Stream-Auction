<script lang="ts">
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import NumberInput from './NumberInput.svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import anime from 'animejs';

	export let id: number;
	export let title: string;
	export let value: number;
	export let percent: number;
	export let color: string;

	let valueToAdd: number;
	let isHovered = false;
	let isAddInputVisible = false;
	let additionalInputElement: HTMLInputElement;
	let element: HTMLDivElement;
	let animation: anime.AnimeInstance;

	onMount(() => {
		return lots.lotValueChanged.subscribe((lot) => {
			if (lot?.id === id) animate();
		});
	});

	function animate() {
		if (animation) {
			animation.restart();
		} else {
			animation = anime({
				targets: element,
				scale: 1.05,
				backgroundColor: color,
				easing: 'easeOutCubic',
				direction: 'alternate',
				duration: 350
			});
		}
	}

	function showInput() {
		isAddInputVisible = true;
		setTimeout(() => additionalInputElement.focus(), 100);
	}

	function hideInputAndAddValue() {
		isAddInputVisible = false;
		addValue();
	}

	function addValue() {
		if (valueToAdd < 1) return;

		lots.addValue(id, Number(valueToAdd));
		valueToAdd = 0;
	}

	function handleDrop(e: DragEvent) {
		const data = e.dataTransfer?.getData('application/json');
		if (!data || !isValidData(e)) return;

		const donation = JSON.parse(data);

		lots.addValue(id, donation.value, donation.username);
		donations.remove(donation.id);
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

<div
	style="--lot-color: {color};"
	class="lot"
	class:hovered={isHovered}
	data-lot-id="#{id}"
	aria-hidden
	bind:this={element}
	on:dragover|preventDefault={(e) => handleDragOver(e)}
	on:dragleave|preventDefault={(e) => handleDragLeave(e)}
	on:drop|preventDefault={(e) => handleDrop(e)}
>
	<div class="lot__id" style="--lot-id-color: {color};">#{id}</div>
	<div class="lot-inputs-wrapper">
		<Input
			--input-w-w="100%"
			id="lot-text-{id}"
			type="text"
			placeholder="Название лота"
			onEnter={() => lots.setTitle(id, title)}
			onInput={() => lots.setTitle(id, title)}
			onBlur={() => lots.setTitle(id, title)}
			isBorderless={true}
			bind:value={title}
		/>
		<NumberInput
			--input-w="90px"
			--input-text-al="center"
			id="lot-value-{id}"
			placeholder="Сумма"
			onEnter={() => lots.setValue(id, value)}
			onBlur={() => lots.setValue(id, value)}
			isPreventInput={true}
			isBorderless={true}
			bind:value
		/>
	</div>
	{#if isAddInputVisible}
		<div style="display: flex;" transition:slide={{ axis: 'x', duration: 200 }}>
			<NumberInput
				--input-w="90px"
				--input-text-al="center"
				id="lot-add-value-{id}"
				placeholder="Сумма"
				onEnter={hideInputAndAddValue}
				isBorderless={true}
				bind:element={additionalInputElement}
				bind:value={valueToAdd}
			/>
		</div>
	{/if}
	<div class="lot__percent">{Number(percent.toFixed(1))}%</div>
	<div style="z-index: 0; display: flex; align-items: center; margin-right: 10px;">
		<Button icon="plus" on:click={isAddInputVisible ? hideInputAndAddValue : showInput} />
		<Button icon="listRemoveItem" on:click={() => lots.remove(id)} />
	</div>
</div>

<style lang="scss">
	.lot {
		display: flex;
		width: 100%;
		background-color: transparent;

		&__id {
			position: relative;
			display: flex;
			z-index: 1;
			align-items: center;
			justify-content: center;
			margin-right: 10px;
			min-width: 60px;
			font-weight: 500;
			letter-spacing: 0.25px;
			color: white;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				background-color: var(--lot-id-color, transparent);
				opacity: 0.4;
			}
		}

		&-inputs-wrapper {
			display: flex;
			flex: 1;
		}

		&__percent {
			z-index: 0;
			display: flex;
			align-self: center;
			justify-content: center;
			padding: 0 10.5px;
			min-width: 90px;
			font-variant-numeric: tabular-nums;
		}

		&.hovered {
			z-index: 999;
			outline: 3px solid white;
		}
	}
</style>
