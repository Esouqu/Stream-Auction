<script lang="ts">
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import NumberInput from './NumberInput.svelte';
	import { slide } from 'svelte/transition';
	import anime from 'animejs';
	import plusIcon from '$lib/assets/add_icon.svg';
	import listRemoveIcon from '$lib/assets/list_remove_icon.svg';

	export let id: number;
	export let title: string;
	export let value: number;
	export let percent: string;
	export let color: string;
	export let isCompact = false;

	let prevValue = value;
	let valueToAdd = 0;
	let isHovered = false;
	let isAddInputVisible = false;
	let additionalInputElement: HTMLInputElement;
	let element: HTMLDivElement;
	let animation: anime.AnimeInstance;

	$: lastAddedLot = lots.lastAddedItem;
	$: lastUpdatedLot = lots.lastUpdatedItem;
	$: {
		if (prevValue !== value) {
			prevValue = value;
			animate();
		} else if (($lastAddedLot?.id === id || $lastUpdatedLot?.id === id) && element) {
			animate();
		}
	}

	function animate() {
		const startPosition = isCompact ? -40 : -80;
		const endPosition = isCompact ? 140 : 180;

		if (animation) {
			animation.restart();
		} else {
			animation = anime({
				targets: element,
				backgroundPosition: [`${startPosition}% 0`, `${endPosition}% 0`],
				duration: 2000,
				easing: 'easeOutCubic'
			});
		}
	}

	function showInput() {
		isAddInputVisible = true;
		setTimeout(() => additionalInputElement.focus(), 100);
	}

	function setValue() {
		lots.setValue(id, value);
	}

	function addValue() {
		lots.addValue(id, valueToAdd);

		valueToAdd = 0;
		isAddInputVisible = false;
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
	<div class="lot__id">#{id}</div>
	<div class="lot-inputs-wrapper" {title}>
		{#if isCompact}
			<div style="display: grid; align-items: center; width: 100%;">
				<div class="lot__title">{title}</div>
			</div>
		{:else}
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
				onEnter={setValue}
				onBlur={setValue}
				isPreventInput={true}
				isBorderless={true}
				bind:value
			/>
		{/if}
	</div>
	{#if isAddInputVisible}
		<div style="display: flex;" transition:slide={{ axis: 'x', duration: 200 }}>
			<NumberInput
				--input-w="90px"
				--input-text-al="center"
				id="lot-add-value-{id}"
				placeholder="Сумма"
				onEnter={addValue}
				isBorderless={true}
				bind:element={additionalInputElement}
				bind:value={valueToAdd}
			/>
		</div>
	{/if}
	<div class="lot__percent">{percent}</div>
	{#if !isCompact}
		<div style="z-index: 0; display: flex; align-items: center; margin-right: 10px;">
			<Button
				icon={plusIcon}
				color="transparent"
				on:click={isAddInputVisible ? addValue : showInput}
			/>
			<Button icon={listRemoveIcon} color="transparent" on:click={() => lots.remove(id)} />
		</div>
	{/if}
</div>

<style lang="scss">
	.lot {
		z-index: 1;
		display: flex;
		width: 100%;
		background-color: transparent;
		background-image: linear-gradient(
			to left,
			transparent 5%,
			var(--lot-color),
			var(--lot-color),
			transparent 95%
		);
		background-position: -100%;
		background-size: 100vw 100%;
		background-repeat: no-repeat;

		&__title {
			z-index: 0;
			padding: 0 10px;
			width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: 0.25px;
			overflow: hidden;
		}

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
				background-color: var(--lot-color, transparent);
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
