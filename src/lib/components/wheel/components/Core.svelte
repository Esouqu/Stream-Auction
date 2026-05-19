<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import ArrowIcon from '@lucide/svelte/icons/arrow-right';
	import type { ILot } from '$lib/interfaces';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { cn, formatCurrencyNumber } from '$lib/utils';
	import { BLUR_PANEL_STYLES } from '$lib/components/BlurPanel.svelte';

	type Props = {
		winner: (ILot & { startAngle: number; endAngle: number }) | null;
	};

	const { winner }: Props = $props();

	const app = getAppManagerContext();
	const { wheel, lots } = app;
	const winnerPercent = $derived(
		winner ? `${((winner.value / lots.totalValue) * 100).toFixed(1)}%` : 0
	);
	const additionalDonators = $derived(winner ? winner.donators.slice(1) : []);
</script>

<div
	class="absolute top-1/2 left-1/2 z-10 flex size-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full data-[finished=true]:bg-black/50"
	data-finished={wheel.isFinished}
>
	<div
		class={cn(
			BLUR_PANEL_STYLES,
			'relative grid h-fit w-full items-center justify-center mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] text-center text-base font-semibold transition-colors duration-300'
		)}
	>
		{#if app.spinExtends > 0}
			<div
				class="relative col-start-1 row-start-1 flex h-full w-full flex-col items-center justify-center text-center text-base font-semibold text-foreground transition-colors duration-300 text-shadow-none"
				transition:slide
			>
				<h2 class="text-2xl">{app.spinExtends > 1 ? 'Вклин x' + app.spinExtends : 'Вклин'}</h2>
				<div class="grid">
					{#key app.spinExtendPrice}
						<div
							class="col-start-1 row-start-1 flex gap-1"
							in:fly={{ x: 100 }}
							out:fly={{ x: -100 }}
						>
							<span class="text-muted-foreground">
								{app.spinExtendPrice - app.settings.spinExtendPriceGain} RUB
							</span>
							<ArrowIcon />
							{app.spinExtendPrice} RUB
						</div>
					{/key}
				</div>
			</div>
		{:else if winner}
			<div class="z-20 col-start-1 row-start-1 w-full px-20" transition:slide>
				<p class="line-clamp-1 overflow-hidden text-center text-2xl overflow-ellipsis">
					{winner.title}
				</p>

				{#if wheel.isFinished}
					<div class="flex flex-col justify-center" transition:slide>
						<div>
							<span class="text-muted-foreground">за</span>
							{formatCurrencyNumber(winner.value)}
							<span class="text-muted-foreground">({winnerPercent})</span>
						</div>
						{#if winner.donators.length > 0}
							<div>
								<span class="text-muted-foreground">от</span>
								{winner.donators[0]}
								{#if additionalDonators.length > 0}
									<span class="text-muted-foreground" title={additionalDonators.join(', ')}
										>+{additionalDonators.length}</span
									>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
