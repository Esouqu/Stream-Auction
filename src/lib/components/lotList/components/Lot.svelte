<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';
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
		isDonatorsShown: boolean;
	}

	const { id, title, value, percent, color, donators, isDonatorsShown, isDarkColor }: Props =
		$props();

	const app = getAppManagerContext();
	const { lots } = app;
	const sharedInputStyle = 'border-none hover:bg-primary/10 focus-visible:bg-background';
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

	let valueToAdd: number | null = $state(null);
	let addedValue = new Tween(0, { delay: 0.5 });
	let isDraggedOver = $state(false);
	let isAddInputVisible = $state(false);
	let isDirty = $state(false);
	let shouldAnimateAddedValue = $state(false);
	let isFresh = $derived.by(getIsFresh);

	let additionalInputRef: HTMLInputElement | null = $state(null);

	function getIsFresh() {
		const data = lots.newelyAddedLots.find((item) => item.id === id);

		return data && !isDirty;
	}

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
		isDraggedOver = false;
	}

	function ondragover(e: DragEvent) {
		e.preventDefault();
		if (isValidData(e)) isDraggedOver = true;
	}

	function ondragleave(e: DragEvent) {
		e.preventDefault();

		if (isValidData(e)) isDraggedOver = false;
	}

	function isValidData(e: DragEvent) {
		const data = e.dataTransfer;
		if (!data) return false;

		return data.types.includes('application/json');
	}
</script>

<div class="relative w-full">
	{#if isFresh}
		<div
			class="absolute top-0 left-0 flex size-full items-center justify-center gap-1 rounded-r-full font-medium"
			style="background-color: rgb({color.r} {color.g} {color.b}); color: {isDarkColor
				? 'white'
				: 'black'}"
			transition:slide|global={{ axis: 'x', easing: expoOut }}
			onmouseenter={() => (isDirty = true)}
			onfocus={() => (isDirty = true)}
			role="button"
			tabindex={0}
		>
			<div class="max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap">
				{title}
			</div>
			<div>—</div>
			<div>
				{value}
			</div>
		</div>
	{:else}
		<div
			class="relative grid w-full grid-cols-[3.5rem_1fr_8rem_auto] outline-2 transition-colors duration-200"
			style="outline-color: rgb({color.r} {color.g} {color.b} / {isDraggedOver
				? '70%'
				: '0%'}); background-color: rgb({color.r} {color.g} {color.b} / {isDraggedOver
				? '15%'
				: '0%'});"
			role="banner"
			{ondragover}
			{ondragleave}
			{ondrop}
		>
			<div
				class="bg-opacity-50 sticky top-0 left-0 flex items-center justify-center rounded-r-full px-4 font-semibold"
				style="background-color: rgb({color.r} {color.g} {color.b} / 15%);color: rgb({color.r} {color.g} {color.b} / 70%)"
			>
				{id}
			</div>

			<div class="relative flex">
				{#if isDonatorsShown}
					<div class="flex items-center pl-3">
						{#if donators.length > 0}
							{donators.join(', ')}
						{:else}
							<div class="text-muted-foreground">Донатеры не указаны</div>
						{/if}
					</div>
				{:else}
					<Input
						id="lot-title-{id}"
						type="text"
						class={cn(sharedInputStyle, 'text-ellipsis')}
						placeholder="Название лота"
						onConfirmation={setTitle}
						value={title}
					/>
				{/if}
			</div>

			<div class="relative">
				{#if shouldAnimateAddedValue}
					<div
						class="absolute z-50 flex h-full w-full items-center justify-center rounded font-medium"
						style="background-color: rgb({color.r} {color.g} {color.b}); color: {isDarkColor
							? 'white'
							: 'black'}"
						transition:fade={{ duration: 300 }}
					>
						{addedValue.target > 0 ? '+' : ''}{Math.round(addedValue.current)}
					</div>
				{/if}
				<Input
					id="lot-value-{id}"
					type="number"
					class={cn(sharedInputStyle, 'pr-14 text-end tabular-nums')}
					placeholder="Сумма"
					onConfirmation={setValue}
					suffix={percent}
					suffixSize="sm"
					{value}
				/>
			</div>

			<div class="flex items-center pr-4">
				{#if isAddInputVisible}
					<div class="h-full" transition:slide={{ axis: 'x', duration: 200 }}>
						<Input
							id="lot-add-value-{id}"
							type="number"
							class={cn(sharedInputStyle, 'w-24')}
							placeholder="Сумма"
							bind:ref={additionalInputRef}
							bind:value={valueToAdd}
							onConfirmation={addValue}
						/>
					</div>
				{/if}

				<DropdownMenu items={actionItems} class={sharedInputStyle}>
					{#snippet trigger()}
						<EllipsisIcon />
					{/snippet}
				</DropdownMenu>
			</div>
		</div>
	{/if}
</div>
