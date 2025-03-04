<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { flip } from 'svelte/animate';
	import { ScrollArea } from '../ui/scroll-area';
	import Donation from './components/Donation.svelte';

	const { donations } = getAppManagerContext();
</script>

<ScrollArea class="h-full" type="scroll">
	<div class="flex h-full flex-col gap-4 p-4">
		{#each donations.items as item (item.id)}
			<div class="w-full" animate:flip={{ duration: 200 }}>
				<Donation {...item} isInteractive />
			</div>
		{/each}
	</div>
</ScrollArea>
