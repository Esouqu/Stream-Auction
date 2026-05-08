<script lang="ts">
	import BlurPanel from '$lib/components/BlurPanel.svelte';
	import ListAddIcon from '$lib/components/icons/ListAddIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import type { FlyDirection } from '$lib/interfaces';
	import type { IDonation } from '$lib/stores/DonationStore.svelte';
	import { formatCurrencyNumber } from '$lib/utils';
	import XIcon from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';

	type Props = {
		donation: IDonation;
		icon: Snippet;
		onRemove?: (direction: FlyDirection) => void;
		onAdd?: (direction: FlyDirection) => void;
	};

	const { donation, icon, onRemove, onAdd }: Props = $props();
	const { id, message, username, amount } = donation;

	const { lots, donations } = getAppManagerContext();

	function removeDonation() {
		onRemove?.(1);
		donations.remove(id);
	}

	function addNewLot() {
		onAdd?.(-1);
		lots.add(message, amount, [username]);
		donations.remove(id);
	}
</script>

<div class="space-y-2 p-4">
	<div class="flex items-center justify-between gap-4 font-semibold">
		<div class="line-clamp-1 flex items-center gap-2">
			{@render icon()}
			<div class="truncate" title={username}>{username}</div>
		</div>
		<div class="whitespace-nowrap">{formatCurrencyNumber(amount)}</div>
	</div>
	<div class="overflow-hidden break-words text-muted-foreground">
		{message}
	</div>
	<BlurPanel class="flex w-full p-1!">
		<Button
			variant="ghost"
			size="sm"
			class="w-full shrink rounded-r-none text-muted-foreground"
			onclick={addNewLot}
		>
			<ListAddIcon class="size-6" />
		</Button>

		<Button
			variant="ghost"
			size="sm"
			class="w-full shrink rounded-l-none text-muted-foreground"
			onclick={removeDonation}
		>
			<XIcon />
		</Button>
	</BlurPanel>
</div>
