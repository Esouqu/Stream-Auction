<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import Spinner from './Spinner.svelte';
	import DashedCircleIcon from '@lucide/svelte/icons/circle-dashed';
	import CheckIcon from '@lucide/svelte/icons/circle-check';
	import { fly } from 'svelte/transition';
	import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
	import type DonationSocket from '$lib/stores/DonationSocket.svelte';

	const app = getAppManagerContext();

	function toggleConnection(socket: DonationSocket) {
		if (socket.isClosed) socket.connect();
		else if (socket.isOpen) socket.disconnect();
	}
</script>

<div class="absolute right-4 bottom-4 left-4 z-50 mx-auto flex" in:fly={{ y: 200, duration: 500 }}>
	<Select type="multiple">
		<SelectTrigger class="flex w-full">
			<div class="flex items-center gap-4">
				Донаты
				<div class="flex gap-2">
					{#each app.donationSockets as socket (socket.id)}
						<div
							class="data-[open=true]:{socket.color} {socket.color} relative size-2 rounded-full border transition-colors data-[open=false]:bg-stone-500"
							data-open={socket.isOpen}
						></div>
					{/each}
				</div>
			</div>
		</SelectTrigger>
		<SelectContent side="top">
			{#each app.donationSockets as socket (socket.id)}
				<SelectItem
					noCheckmark
					value={socket.id}
					disabled={socket.isConnecting}
					onclick={() => toggleConnection(socket)}
				>
					{#if socket.isConnecting}
						<Spinner />
					{:else if socket.isOpen}
						<CheckIcon class="text-green-500" />
					{:else}
						<DashedCircleIcon />
					{/if}
					{socket.id}
				</SelectItem>
			{/each}
		</SelectContent>
	</Select>
</div>
