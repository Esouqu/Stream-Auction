<script lang="ts">
	import { type IDonation } from '$lib/stores/DonationStore.svelte';
	import { fly } from 'svelte/transition';
	import DonationAlertsIcon from '../../icons/DonationAlertsIcon.svelte';
	import DonatePayIcon from '../../icons/DonatePayIcon.svelte';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import InstantCard from './InstantCard.svelte';
	import DefaultCard from './DefaultCard.svelte';
	import type { FlyDirection } from '$lib/interfaces';

	type Props = {
		donation: IDonation;
	};

	const { donation }: Props = $props();
	const { id, username, amount, source, isInstant } = donation;

	let flyDirection: FlyDirection = $state(1);
	let isDragged = $state(false);
	const { gradient, Icon } = $derived.by(getSourceStyles);

	function getSourceStyles() {
		switch (source) {
			case 'DonationAlerts':
				return {
					gradient: 'bg-gradient-to-b from-[#fa9d3e] to-[#f76b1c]',
					Icon: DonationAlertsIcon
				};
			case 'DonatePay':
				return {
					gradient: 'bg-gradient-to-b from-[#5db180] to-[#44AB4F]',
					Icon: DonatePayIcon
				};
			default:
				return {
					gradient: 'bg-none',
					Icon: CreditCardIcon
				};
		}
	}

	function changeDirection(direction: FlyDirection) {
		flyDirection = direction;
	}

	function ondragend() {
		isDragged = false;
	}

	function ondragstart(e: DragEvent) {
		e.dataTransfer?.setData('application/json', JSON.stringify({ id, amount, username }));
		changeDirection(-1);
		isDragged = true;
	}
</script>

{#snippet icon()}
	<div class={['size-fit rounded-md p-2', gradient]}>
		<Icon class="size-5" />
	</div>
{/snippet}

<div
	class="relative w-full overflow-hidden rounded-lg select-none data-[dragged=true]:opacity-30 data-[dragged=true]:grayscale data-[dragged=true]:transition-none"
	data-dragged={isDragged}
	draggable={!isInstant}
	role="banner"
	{ondragstart}
	{ondragend}
	in:fly={{ y: 200 }}
	out:fly={{ x: 500 * flyDirection }}
>
	<div class="relative z-20 flex w-full flex-col overflow-hidden bg-card">
		{#if isInstant}
			<InstantCard {donation} {icon} />
		{:else}
			<DefaultCard {donation} {icon} onAdd={changeDirection} onRemove={changeDirection} />
		{/if}
	</div>
</div>
