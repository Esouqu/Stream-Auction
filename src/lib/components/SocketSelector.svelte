<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import type { IDonationSocket } from '$lib/interfaces';
	import { Toggle } from './ui/toggle';
	import Spinner from './Spinner.svelte';
	import DashedCircleIcon from '@lucide/svelte/icons/circle-dashed';
	import CheckIcon from '@lucide/svelte/icons/circle-check';

	const app = getAppManagerContext();

	function toggleConnection(socket: IDonationSocket) {
		if (socket.isClosed) socket.connect();
		else if (socket.isOpen) socket.disconnect();
	}
</script>

<div class="flex justify-center gap-2 p-4">
	{#each app.donationSockets as socket}
		<Toggle
			onclick={() => toggleConnection(socket)}
			disabled={socket.isConnecting}
			bind:pressed={socket.isOpen}
		>
			{#if socket.isConnecting}
				<Spinner />
			{:else if socket.isOpen}
				<CheckIcon class="text-green-500" />
			{:else}
				<DashedCircleIcon />
			{/if}
			{socket.id}
		</Toggle>
	{/each}
</div>
