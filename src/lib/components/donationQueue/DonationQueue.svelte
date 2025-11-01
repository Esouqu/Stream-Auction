<script lang="ts">
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { flip } from 'svelte/animate';
	import { ScrollArea } from '../ui/scroll-area';
	import Donation from './components/Donation.svelte';

	const { donations } = getAppManagerContext();
</script>

<ScrollArea class="h-full overflow-hidden" type="scroll">
	<div class="space-y-2 p-4 pb-[84px]">
		{#each donations.items as donation (donation.id)}
			<div class="w-full" animate:flip={{ duration: 200 }}>
				<Donation {donation} />
			</div>
		{/each}
	</div>
</ScrollArea>
