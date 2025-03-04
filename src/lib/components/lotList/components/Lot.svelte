<script lang="ts">
	import EllipsisIcon from 'lucide-svelte/icons/ellipsis';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import TrashIcon from 'lucide-svelte/icons/trash';
	import type { ILot } from '$lib/interfaces';
	import { fade, slide } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import Input from '$lib/components/Input.svelte';
	import DropdownMenu, { type IDropdownItem } from '$lib/components/DropdownMenu.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Tween } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';

	interface Props extends ILot {
		percent: string;
		itemHeight: number;
	}

	const app = getAppManagerContext();
	const { lots } = app;
	const sharedInputStyle =
		'h-full border-transparent hover:bg-white/10 focus-visible:bg-background';
	const actionItems: IDropdownItem[] = [
		{
			label: 'Прибавить',
			value: 'add',
			Icon: PlusIcon,
			onclick: toggleAddionalInput
		},
		{
			label: 'Удалить',
			value: 'remove',
			Icon: TrashIcon,
			onclick: remove
		}
	];

	const { id, title, value, percent, color, isDarkColor, itemHeight }: Props = $props();

	let valueToAdd: number | null = $state(null);
	let addedValue = new Tween(0, { delay: 0.5 });
	let isHovered = $state(false);
	let isAddInputVisible = $state(false);

	let additionalInputRef: HTMLInputElement | null = $state(null);
	let shouldAnimateAddedValue = $state(false);
	let isNewelyAddedLot = $state(false);

	$effect(() => {
		const data = lots.newelyAddedLots.find((item) => item.id === id);

		if (data) {
			isNewelyAddedLot = true;
		} else {
			isNewelyAddedLot = false;
		}
	});

	$effect(() => {
		const data = lots.addedValues.find((item) => item.id === id);

		if (data) {
			addedValue.set(data.value);
			shouldAnimateAddedValue = true;
		} else {
			addedValue.set(0);
			shouldAnimateAddedValue = false;
		}
	});

	$effect(() => {
		if (isAddInputVisible) {
			setTimeout(() => additionalInputRef?.focus(), 200);
		} else {
			valueToAdd = null;
		}
	});

	function toggleAddionalInput() {
		isAddInputVisible = !isAddInputVisible;
	}

	function remove() {
		lots.remove(id);
	}

	function setTitle(val: number | string | null) {
		if (typeof val !== 'string') throw new Error('Invalid title');

		lots.setTitle(id, val);
	}

	function setValue(val: number | string | null) {
		if (typeof val !== 'number') throw new Error('Invalid value');

		lots.setValue(id, val);
	}

	function addValue() {
		if (!valueToAdd) {
			isAddInputVisible = false;
			return;
		}

		lots.addValue(id, valueToAdd);
		isAddInputVisible = false;
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();

		const data = e.dataTransfer?.getData('application/json');
		if (!data || !isValidData(e)) return;

		const donation = JSON.parse(data);

		app.transferDonation(donation, id);
		isHovered = false;
	}

	function ondragover(e: DragEvent) {
		e.preventDefault();

		if (isValidData(e)) isHovered = true;
	}

	function ondragleave(e: DragEvent) {
		e.preventDefault();

		if (isValidData(e)) isHovered = false;
	}

	function isValidData(e: DragEvent) {
		const data = e.dataTransfer;
		if (!data) return false;

		return data.types.includes('application/json');
	}
</script>

<div
	class="relative grid w-full grid-cols-[3.5rem_1fr_8rem_auto] bg-opacity-10 text-sm transition-colors data-[hovered=true]:bg-opacity-50"
	data-hovered={isHovered}
	style="height: {itemHeight}rem; background-color: rgb({color.r} {color.g} {color.b} / var(--tw-bg-opacity));"
	role="banner"
	{ondragover}
	{ondragleave}
	{ondrop}
>
	{#if isNewelyAddedLot}
		<div
			class="absolute z-50 flex h-full w-full items-center justify-center gap-1 font-medium"
			style="background-color: rgb({color.r} {color.g} {color.b}); color: {isDarkColor
				? 'white'
				: 'black'}"
			in:slide={{ axis: 'x', easing: expoOut }}
			out:fade
		>
			<div class="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
				{title}
			</div>
			<div>—</div>
			<div>
				{value} RUB
			</div>
		</div>
	{/if}

	<div class="flex items-center bg-opacity-50 px-4 font-medium">{id}</div>
	<div class="relative flex">
		<Input
			id="lot-title-{id}"
			type="text"
			class={cn(sharedInputStyle, 'text-ellipsis')}
			placeholder="Название лота"
			onConfirmation={setTitle}
			value={title}
		/>
	</div>
	<div class="relative">
		{#if shouldAnimateAddedValue}
			<div
				class="absolute z-50 flex h-full w-full items-center justify-center rounded font-medium"
				transition:fade={{ duration: 300 }}
				style="background-color: rgb({color.r} {color.g} {color.b}); color: {isDarkColor
					? 'white'
					: 'black'}"
			>
				{addedValue.target > 0 ? '+' : ''}{Math.round(addedValue.current)} RUB
			</div>
		{/if}
		<Input
			id="lot-value-{id}"
			type="number"
			class={cn(sharedInputStyle, 'pr-14 text-end')}
			placeholder="Сумма"
			onConfirmation={setValue}
			{value}
		/>
		<div
			class="pointer-events-none absolute bottom-[calc(50%-0.75rem)] right-3 z-40 flex select-none items-center text-xs leading-[1.3rem] text-muted-foreground"
		>
			{percent}
		</div>
	</div>
	<div class="flex items-center pr-4">
		{#if isAddInputVisible}
			<div class="h-full" transition:slide={{ axis: 'x', duration: 200 }}>
				<Input
					id="lot-add-value-{id}"
					type="number"
					class={cn(sharedInputStyle, 'w-20')}
					placeholder="Сумма"
					bind:ref={additionalInputRef}
					bind:value={valueToAdd}
					onConfirmation={addValue}
				/>
			</div>
		{/if}

		<!-- <Toggle bind:pressed={isAddInputVisible}>
			<PlusIcon />
		</Toggle>
		<Button onclick={remove}>
			<TrashIcon />
		</Button> -->
		<DropdownMenu items={actionItems} class={sharedInputStyle}>
			{#snippet trigger()}
				<EllipsisIcon />
			{/snippet}
		</DropdownMenu>
	</div>
</div>
