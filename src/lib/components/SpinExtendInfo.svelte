<script lang="ts">
	import { page } from '$app/stores';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

	const app = getAppManagerContext();

	const currentRouteId = $derived($page.route.id);
	const isShown = $derived(
		app.settings.isSpinExtendEnabled &&
			app.donationSockets.length > 0 &&
			currentRouteId === '/wheel'
	);
</script>

{#if isShown}
	<div class="flex gap-2">
		<div
			class="flex w-full flex-col items-center justify-center rounded-xl bg-card/40 p-2 font-semibold"
		>
			<div>Вклин</div>
			<div class="flex gap-1">
				{app.spinExtendPrice} RUB (<TrendingUpIcon class="size-5" />{app.settings
					.spinExtendPriceGain} )
			</div>
		</div>
		<div
			class="flex w-full flex-col items-center justify-center rounded-xl bg-card/40 p-2 font-semibold"
		>
			<div>Стоп Колесо</div>
			<div>{app.settings.spinStopPrice} RUB</div>
		</div>
	</div>
{/if}
