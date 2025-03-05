<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import type { IDonationSocket } from '$lib/interfaces';
	import { Toggle } from './ui/toggle';
	import Spinner from './Spinner.svelte';
	import XIcon from 'lucide-svelte/icons/circle-dashed';
	import CheckIcon from 'lucide-svelte/icons/circle-check';

	const app = getAppManagerContext();

	function toggleConnection(socket: IDonationSocket) {
		if (socket.isClosed) socket.connect();
		else if (socket.isOpen) socket.disconnect();
	}
</script>

<div>
	{#each app.donationSockets as socket}
		<Toggle
			class="group data-[state=off]:text-muted-foreground data-[state=on]:text-foreground"
			onclick={() => toggleConnection(socket)}
			disabled={socket.isConnecting}
			pressed={socket.isOpen}
		>
			{#if socket.isConnecting}
				<Spinner />
			{:else if socket.isOpen}
				<CheckIcon class="text-green-500" />
			{:else}
				<XIcon class="text-muted-foreground" />
			{/if}
			{socket.id}
		</Toggle>
	{/each}
</div>
