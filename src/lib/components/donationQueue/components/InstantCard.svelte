<script lang="ts">
	import type { IDonation } from '$lib/stores/DonationStore.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		donation: IDonation;
		icon: Snippet;
	};

	const { donation, icon }: Props = $props();
	const { amount, currency, message } = donation;
</script>

<div class="flex w-full items-center justify-between gap-4 p-4">
	<div class="flex items-center gap-2">
		{@render icon()}
		<div>{message}</div>
	</div>
	<div class="min-w-fit">+{amount} {currency}</div>
</div>
