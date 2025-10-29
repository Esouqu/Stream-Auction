<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import DicesIcon from '@lucide/svelte/icons/dices';
	import Input from '$lib/components/Input.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { randomFromRange } from '$lib/utils';
	import { Tween } from 'svelte/motion';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import { fade, fly } from 'svelte/transition';
	import { BLUR_PANEL_STYLES } from '$lib/components/BlurPanel.svelte';

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

<div
	class={[BLUR_PANEL_STYLES, 'absolute bottom-[5rem] left-1/2 z-10 flex -translate-x-1/2 gap-2']}
	in:fly|global={{ y: 250, duration: 500 }}
	out:fade
>
	<Button class="rounded-full" disabled={isWheelActive} onclick={startSpin}>
		<RefreshCwIcon />
		Крутить
	</Button>
	<Tooltip>
		<TooltipTrigger>
			<Input
				id="wheel-spin"
				type="number"
				class="w-[6rem] rounded-full"
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
						class="rounded-full"
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
						class="rounded-full"
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
