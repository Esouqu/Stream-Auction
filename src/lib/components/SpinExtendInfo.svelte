<script lang="ts">
	import { page } from '$app/state';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { formatCurrencyNumber } from '$lib/utils';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import { slide } from 'svelte/transition';

	const app = getAppManagerContext();

	const extendPrice = $derived(formatCurrencyNumber(app.spinExtendPrice));
	const extendPriceGain = $derived(app.settings.spinExtendPriceGain);
	const spinStopPrice = $derived(formatCurrencyNumber(app.settings.spinStopPrice));
	const currentRouteId = $derived(page.route.id);
	const isShown = $derived(
		app.settings.isSpinExtendEnabled &&
			app.donationSockets.length > 0 &&
			currentRouteId === '/wheel'
	);
</script>

{#if isShown}
	<div class="flex shrink-0 gap-2" transition:slide>
		<div class="flex w-full flex-col justify-center rounded-xl bg-card/40 p-4">
			<div>Вклин</div>
			<div class="flex justify-between gap-1 text-xl font-bold">
				<div>{extendPrice}</div>
				<div class="inline-flex items-center gap-1 text-base font-medium text-green-400">
					<TrendingUpIcon class="inline size-4.5" />
					{extendPriceGain}
				</div>
			</div>
		</div>
		<div class="flex w-full flex-col justify-center rounded-xl bg-card/40 p-4">
			<div>Стоп Колесо</div>
			<div class="text-xl font-bold">{spinStopPrice}</div>
		</div>
	</div>
{/if}
