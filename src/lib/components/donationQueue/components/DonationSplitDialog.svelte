<script lang="ts">
	import { Button, buttonVariants } from '../../ui/button';
	import SplitIcon from 'lucide-svelte/icons/split';
	import TrashIcon from 'lucide-svelte/icons/trash';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '../../ui/dialog';
	import { cn } from '$lib/utils';
	import Input from '../../Input.svelte';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import { slide } from 'svelte/transition';
	import { ScrollArea } from '../../ui/scroll-area';
	import type { IDonation } from '$lib/stores/DonationStore.svelte';
	import Donation from './Donation.svelte';
	import { Separator } from '../../ui/separator';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	interface IDonationInputs {
		message: string;
		amount: number | null;
	}

	interface Props extends IDonation {}

	const { id, message, amount, username, currency }: Props = $props();

	const emptyDonation = { message: 'zxcvb', amount: 30 };
	const initialLots = [emptyDonation, emptyDonation];
	const appManager = getAppManagerContext();

	let open = $state(false);
	let donationInputs: IDonationInputs[] = $state(initialLots);
	let splittedDonations: Omit<IDonation, 'id' | 'isInstant'>[] = $derived(
		donationInputs.map((d) => ({ ...d, username, currency, amount: d.amount ?? 0 }))
	);

	$effect(() => {
		if (!open) donationInputs = initialLots;
	});

	function splitAndAdd() {
		appManager.splitDonationAndAddLots(id, splittedDonations);
		closeDialog();
	}

	function split() {
		appManager.splitDonation(id, splittedDonations);
		closeDialog();
	}

	function increaseDonationsAmount() {
		donationInputs.push(emptyDonation);
	}

	function closeDialog() {
		open = false;
	}
</script>

<Dialog bind:open>
	<DialogTrigger
		class={cn(
			buttonVariants({
				variant: 'ghost',
				size: 'icon'
			}),
			'w-full'
		)}
	>
		<SplitIcon />
	</DialogTrigger>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Разделение доната</DialogTitle>
		</DialogHeader>

		<div class="flex flex-col items-center justify-center gap-2">
			<Donation
				{id}
				{amount}
				{message}
				{username}
				{currency}
				isInstant={false}
				isInteractive={false}
			/>

			<Separator class="my-4" />

			<ScrollArea class="max-h-[20rem] w-full" type="always">
				<div class="flex flex-col gap-2 p-1">
					{#each donationInputs, idx (idx)}
						<div
							class="grid grid-cols-[1fr_0.3fr_auto] justify-center gap-2"
							transition:slide={{ duration: 200 }}
						>
							<div class="flex flex-col gap-2">
								<Input
									id="new-donation-message-{idx}"
									type="text"
									placeholder="Название *"
									bind:value={donationInputs[idx].message}
								/>
							</div>
							<div class="flex flex-col gap-2">
								<Input
									id="new-donation-amount-{idx}"
									type="number"
									placeholder="Сумма *"
									bind:value={donationInputs[idx].amount}
								/>
							</div>
							<div class="flex flex-col gap-2">
								<Button variant="ghost" size="icon" onclick={() => donationInputs.splice(idx, 1)}>
									<TrashIcon />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</ScrollArea>

			<Button class="w-full" variant="ghost" size="icon" onclick={increaseDonationsAmount}>
				<PlusIcon />
			</Button>
		</div>

		<DialogFooter>
			<div class="flex w-full justify-end gap-2">
				<Button onclick={split}>Разделить</Button>
				<Button onclick={splitAndAdd}>Разделить и добавить</Button>
			</div>
		</DialogFooter>
	</DialogContent>
</Dialog>
