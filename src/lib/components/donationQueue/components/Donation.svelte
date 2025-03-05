<script lang="ts">
	import { type IDonation } from '$lib/stores/DonationStore.svelte';
	import { fly } from 'svelte/transition';
	import PlusIcon from 'lucide-svelte/icons/list-plus';
	import XIcon from 'lucide-svelte/icons/x';
	import DonationAlertsIcon from '../../icons/DonationAlertsIcon.svelte';
	import { Button } from '../../ui/button';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import DonatePayIcon from '../../icons/DonatePayIcon.svelte';

	interface Props extends IDonation {
		isInteractive: boolean;
	}

	const {
		id,
		message,
		username,
		amount,
		currency,
		source,
		isInstant,
		isInteractive = true
	}: Props = $props();

	const { lots, donations } = getAppManagerContext();

	let moveDirection: 1 | -1 = $state(1);
	let isDragged = $state(false);

	function removeDonation() {
		moveDirection = 1;
		donations.remove(id);
	}

	function addNewLot() {
		moveDirection = -1;
		lots.add(message, amount, [username]);
		donations.remove(id);
	}

	function ondragend() {
		isDragged = false;
	}

	function ondragstart(e: DragEvent) {
		e.dataTransfer?.setData('application/json', JSON.stringify({ id, amount, username }));
		moveDirection = -1;
		isDragged = true;
	}
</script>

<div
	class="relative grid w-full select-none grid-cols-[auto_1fr_auto] overflow-hidden rounded-md border data-[interactive=false]:select-auto data-[dragged=true]:opacity-30 data-[dragged=true]:grayscale data-[dragged=true]:transition-none"
	data-dragged={isDragged}
	data-interactive={isInteractive}
	draggable={!isInstant && isInteractive}
	role="banner"
	{ondragstart}
	{ondragend}
	in:fly={{ y: 200 }}
	out:fly={{ x: 500 * moveDirection }}
>
	{#if source === 'DonationAlerts'}
		<div class="flex h-full items-center bg-gradient-to-b from-[#fa9d3e] to-[#f76b1c] px-2">
			<DonationAlertsIcon />
		</div>
	{:else if source === 'DonatePay'}
		<div class="flex h-full items-center bg-gradient-to-b from-[#5db180] to-[#44AB4F] px-2">
			<DonatePayIcon />
		</div>
	{/if}

	<div class="relative z-20 flex w-full flex-col overflow-hidden bg-card text-sm">
		{#if isInstant}
			<div class="flex w-full justify-between gap-4 p-4">
				<div>{message}</div>
				<div class="min-w-fit">+{amount} {currency}</div>
			</div>
		{:else}
			<div class="w-full p-4">
				<div class="flex items-center justify-between font-semibold">
					<div>{username}</div>
					<div>{amount} {currency}</div>
				</div>
				<div class="mt-3 overflow-hidden break-words">
					{message}
				</div>
			</div>
			{#if isInteractive}
				<div class="flex w-full">
					<Button variant="ghost" size="icon" class="w-full" onclick={addNewLot}>
						<PlusIcon />
					</Button>

					<Button variant="ghost" size="icon" class="w-full" onclick={removeDonation}>
						<XIcon />
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>
