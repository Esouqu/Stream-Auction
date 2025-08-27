<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import RefreshCwOffIcon from '@lucide/svelte/icons/refresh-cw-off';
	import DicesIcon from '@lucide/svelte/icons/dices';
	import Input from '$lib/components/Input.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { randomFromRange } from '$lib/utils';
	import { Tween } from 'svelte/motion';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import PaletteIcon from '@lucide/svelte/icons/palette';

	const app = getAppManagerContext();
	const { wheel, lots } = app;
	const minDuration = 1;
	const maxDuration = 999;

	let duration = new Tween(wheel.spinDuration, { duration: 300 });
	let isWheelActive = $derived(wheel.isPreparing || wheel.isDelayed || wheel.isSpinning);

	function startSpin() {
		wheel.spinDuration = duration.target;
		wheel.spin();
	}

	function setRandomDuration() {
		const min = wheel.settings.durationRange[0];
		const max = wheel.settings.durationRange[1];

		duration.target = randomFromRange(min, max);
	}

	function setDuration(value: string | number | null) {
		if (value === null) return (duration.target = 1);

		if (typeof value === 'number') {
			duration.target = clamp(value, minDuration, maxDuration);
		}
	}

	function clamp(value: number, min: number, max: number) {
		return Math.max(min, Math.min(max, value));
	}
</script>

<div class="relative mx-auto flex w-fit items-center justify-between gap-4">
	<!-- {#if app.settings.isSpinExtendEnabled && app.donationSockets.length > 0}
		<div
			class="flex h-full w-fit shrink-0 flex-col items-center justify-center rounded-xl bg-card/40 px-4 font-semibold"
		>
			<div>Вклин</div>
			<div class="flex gap-1">
				{app.spinExtendPrice} RUB (<TrendingUpIcon class="size-5" />{app.settings
					.spinExtendPriceGain} RUB )
			</div>
		</div>
		<div
			class="flex h-full w-fit shrink-0 flex-col items-center justify-center rounded-xl bg-card/40 px-4 font-semibold"
		>
			<div>Стоп Колесо</div>
			<div>{app.settings.spinStopPrice} RUB</div>
		</div>
	{/if} -->

	<div class="flex gap-2 rounded-xl bg-card/40 p-4">
		<Button
			variant={isWheelActive ? 'destructive' : 'default'}
			onclick={() => (isWheelActive ? app.stopSpinManually() : startSpin())}
		>
			{#if !isWheelActive}
				<RefreshCwIcon />
				Крутить
			{:else}
				<RefreshCwOffIcon />
				Остановить
			{/if}
		</Button>
		<Tooltip>
			<TooltipTrigger>
				<Input
					id="wheel-spin"
					type="number"
					class="w-[6rem]"
					suffix="сек."
					disabled={isWheelActive}
					onConfirmation={setDuration}
					value={Math.round(duration.current)}
				/>
			</TooltipTrigger>
			<TooltipContent>Длительность</TooltipContent>
		</Tooltip>

		<div class="flex">
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							disabled={isWheelActive}
							onclick={setRandomDuration}
						>
							<DicesIcon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>
					Случайное число от {wheel.settings.durationRange[0]} до {wheel.settings.durationRange[1]}
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							disabled={isWheelActive}
							onclick={() => lots.randomizeColors()}
						>
							<PaletteIcon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>Сгенерировать новые цвета</TooltipContent>
			</Tooltip>
		</div>
	</div>
</div>
