<script lang="ts">
	import BlurPanel from '$lib/components/BlurPanel.svelte';
	import ListAddIcon from '$lib/components/icons/ListAddIcon.svelte';
	import Input from '$lib/components/Input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	const { lots } = getAppManagerContext();

	let lotTitle = $state('');
	let lotValue: number | null = $state(null);
	let isOpen = $state(false);
	const isValid = $derived(!!lotTitle && lotValue !== null);

	function clearInputs() {
		lotTitle = '';
		lotValue = null;
	}

	function addNewLot() {
		if (!lotTitle || lotValue === null) return;

		lots.add(lotTitle, lotValue);

		isOpen = false;
	}
</script>

<BlurPanel class="pointer-events-auto relative flex">
	<Popover bind:open={isOpen} onOpenChangeComplete={() => clearInputs()}>
		<PopoverTrigger class={[buttonVariants({ variant: 'accent' }), 'rounded-full']}>
			<ListAddIcon />
			Новый лот
		</PopoverTrigger>
		<PopoverContent
			class="pointer-events-auto w-min space-y-3 p-3 xl:w-max"
			sideOffset={16}
			align="start"
		>
			<h3 class="text-lg leading-none font-medium tracking-tight">Новый лот</h3>
			<div class="flex flex-wrap justify-center gap-2">
				<Input
					id="new-lot-title"
					type="text"
					placeholder="Название"
					class="w-[248px]"
					onenter={addNewLot}
					bind:value={lotTitle}
				/>
				<Input
					id="new-lot-value"
					type="number"
					placeholder="Сумма"
					class="w-[248px] xl:w-32"
					onenter={addNewLot}
					bind:value={lotValue}
				/>
				<Button class="w-[248px] xl:w-auto" disabled={!isValid} onclick={addNewLot}>
					Добавить
				</Button>
			</div>
		</PopoverContent>
	</Popover>
</BlurPanel>
