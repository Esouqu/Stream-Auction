<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import ArrowIcon from '@lucide/svelte/icons/arrow-right';
	import type { ILot } from '$lib/interfaces';
	import Color from 'color';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	interface Props {
		winner: (ILot & { startAngle: number; endAngle: number }) | null;
		size: number;
		patternImage: string | null;
		strokeColor: string;
	}

	const { winner, size, patternImage, strokeColor }: Props = $props();

	const app = getAppManagerContext();
	const { wheel, lots } = app;
	const backgroundColor = $derived(winner && Color(winner.color).hex());
	const holeSize = $derived(wheel.isFinished ? '95%' : `${Math.round(size)}px`);
</script>

<div
	class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[0.2rem] bg-background shadow-[0_0_1rem_transparent] transition-all duration-500 data-[enlarged=true]:h-[60%] data-[enlarged=true]:w-[60%] data-[glow=true]:shadow-white"
	data-glow={app.spinExtends > 0}
	data-enlarged={wheel.isFinished}
	style="height: {holeSize}; width: {holeSize}; border-color: {strokeColor};"
>
	<div
		class="relative grid h-full w-full items-center justify-center text-center text-base font-semibold transition-colors duration-300"
		style="
			text-shadow:
			-0.125rem -0.125rem 0 black,
			-0.125rem  0   0 black,
			-0.125rem  0.125rem 0 black,
			0   -0.125rem 0 black,
			0    0.125rem 0 black,
			0.125rem -0.125rem 0 black,
			0.125rem  0   0 black,
			0.125rem  0.125rem 0 black;
			background-color: {app.spinExtends > 0 ? strokeColor : backgroundColor};
		"
	>
		{#if app.spinExtends > 0}
			<div
				class="relative col-start-1 row-start-1 flex h-full w-full flex-col items-center justify-center gap-2 text-center text-base font-semibold text-foreground transition-colors duration-300 text-shadow-none"
				in:scale
			>
				<h2 class="text-2xl">{app.spinExtends > 1 ? 'Вклин x' + app.spinExtends : 'Вклин'}</h2>
				<div class="grid">
					{#key app.spinExtendPrice}
						<div
							class="col-start-1 row-start-1 flex gap-1"
							in:fly={{ x: 100 }}
							out:fly={{ x: -100 }}
						>
							<span class="text-muted-foreground">{app.previousSpinExtendPrice} RUB</span>
							<ArrowIcon />
							{app.spinExtendPrice} RUB
						</div>
					{/key}
				</div>
			</div>
		{:else if !wheel.isFinished}
			<p
				class="col-start-1 row-start-1 line-clamp-5 overflow-hidden px-8 text-center text-xl break-words overflow-ellipsis"
				in:scale
			>
				{winner?.title}
			</p>
		{:else}
			<div class="z-20 col-start-1 row-start-1 w-full" in:scale>
				<p
					class="line-clamp-5 overflow-hidden px-8 text-center text-2xl break-normal overflow-ellipsis"
				>
					{winner?.title}
				</p>
				<br />
				<p>
					Сумма: {winner?.value} ({(((winner?.value || 0) / lots.totalValue) * 100).toFixed(1)}%)
				</p>
				<p>
					Заказавшие: {winner?.donators.join(', ')}
				</p>
			</div>
		{/if}
		<div
			class="pointer-events-none absolute h-full w-full bg-[length:17rem_17rem] bg-center opacity-10"
			style="background-image: url({patternImage || ''});"
		></div>
	</div>
</div>
