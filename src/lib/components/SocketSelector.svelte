<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import type { IDonationSocket } from '$lib/interfaces';
	import { Toggle } from './ui/toggle';
	import Spinner from './Spinner.svelte';
	import DashedCircleIcon from '@lucide/svelte/icons/circle-dashed';
	import CheckIcon from '@lucide/svelte/icons/circle-check';
	import { fly } from 'svelte/transition';
	import BlurPanel from './BlurPanel.svelte';

	const app = getAppManagerContext();

	function toggleConnection(socket: IDonationSocket) {
		if (socket.isClosed) socket.connect();
		else if (socket.isOpen) socket.disconnect();
	}

	function isSocketOpen(socket: IDonationSocket) {
		return socket.isOpen;
	}
</script>

{#if app.donationSockets.length > 0}
	<div in:fly={{ y: 200, duration: 500 }}>
		<BlurPanel class="flex">
			{#each app.donationSockets as socket}
				<Toggle
					class="rounded-full"
					variant="ghost"
					disabled={socket.isConnecting}
					bind:pressed={() => isSocketOpen(socket), () => toggleConnection(socket)}
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
		</BlurPanel>
	</div>
{/if}
