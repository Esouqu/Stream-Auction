<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import RefreshCwIcon from 'lucide-svelte/icons/refresh-cw';
	import RefreshCwOffIcon from 'lucide-svelte/icons/refresh-cw-off';
	import DicesIcon from 'lucide-svelte/icons/dices';
	import Input from '$lib/components/Input.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { Badge } from '$lib/components/ui/badge';
	import { randomFromRange } from '$lib/utils';
	import { Tween } from 'svelte/motion';

	const app = getAppManagerContext();
	const { wheel, background } = app;
	const minDuration = 1;
	const maxDuration = 999;

	let duration = new Tween(wheel.spinDuration, { duration: 300 });
	let isActionsDisabled = $derived(wheel.isPreparing || wheel.isDelayed || wheel.isSpinning);

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

<div
	class="relative flex items-center justify-center rounded-lg border bg-secondary px-4 py-2"
	style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
>
	{#if app.settings.isSpinExtendEnabled && app.donationSockets.length > 0}
		<div class="flex w-full items-center gap-2">
			<Badge class="text-sm">
				Вклин — {app.spinExtendPrice} RUB (⇧{app.settings.spinExtendPriceGain} RUB)
			</Badge>
			<Badge class="text-sm">
				Стоп Колесо — {app.settings.spinStopPrice} RUB
			</Badge>
		</div>
	{/if}
	<div class="flex gap-1">
		{#if !isActionsDisabled}
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="default"
							size="icon"
							onclick={startSpin}
							class="active:scale-90"
							disabled={isActionsDisabled}
						>
							<RefreshCwIcon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>Крутить</TooltipContent>
			</Tooltip>
		{:else}
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							class="hover:bg-destructive hover:text-destructive-foreground active:scale-90"
							variant="ghost"
							size="icon"
							onclick={() => app.stopSpinManually()}
						>
							<RefreshCwOffIcon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>Остановить</TooltipContent>
			</Tooltip>
		{/if}
		<div class="flex overflow-hidden rounded">
			<Tooltip>
				<TooltipTrigger>
					<Input
						id="wheel-spin"
						type="number"
						class="w-[3.25rem] rounded-none border-transparent text-center hover:bg-primary/10 focus-visible:bg-background"
						disabled={isActionsDisabled}
						onConfirmation={setDuration}
						value={Math.round(duration.current)}
					/>
				</TooltipTrigger>
				<TooltipContent>Длительность</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							class="rounded-none active:scale-90"
							variant="ghost"
							size="icon"
							disabled={isActionsDisabled}
							onclick={setRandomDuration}
						>
							<DicesIcon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>
					Случайное число ({wheel.settings.durationRange[0]}-{wheel.settings.durationRange[1]})
				</TooltipContent>
			</Tooltip>
		</div>
	</div>
</div>
