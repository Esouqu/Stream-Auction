<script lang="ts">
	import { Button } from './ui/button';
	import PlayIcon from 'lucide-svelte/icons/play';
	import PauseIcon from 'lucide-svelte/icons/pause';
	import ResetIcon from 'lucide-svelte/icons/timer-reset';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import MinusIcon from 'lucide-svelte/icons/minus';
	import Input from './Input.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { slide } from 'svelte/transition';

	const inputStyle =
		'h-[3.25rem] leading-none border-none p-0 text-center tabular-nums hover:bg-muted read-only:hover:bg-transparent read-only:focus-visible:ring-transparent md:w-[4.75rem] md:text-5xl disabled:opacity-100 disabled:cursor-default';
	const { timer, wheel, background } = getAppManagerContext();
	const { hours, minutes, seconds, ms } = $derived(timer.formattedTime);
	const paddedHours = $derived(timeToString(hours));
	const paddedMinutes = $derived(timeToString(minutes));
	const paddedSeconds = $derived(timeToString(seconds));
	const paddedMs = $derived(timeToString(ms));

	function setSeconds(value: number) {
		if (seconds !== value) {
			timer.setSeconds(Math.min(60, Math.max(0, value)));
			timer.setMilliseconds(0);
		}
	}

	function setMinutes(value: number) {
		if (minutes !== value) {
			timer.setMinutes(Math.min(60, Math.max(0, value)));
		}
	}

	function setHours(value: number) {
		if (hours !== value) {
			timer.setHours(Math.min(60, Math.max(0, value)));
		}
	}

	function timeToString(num: number) {
		return String(num).padStart(2, '0');
	}
</script>

<div
	class=" relative flex w-full flex-col items-center border-b bg-secondary p-4"
	style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
>
	<div
		class="transition-color relative flex w-fit flex-col items-center justify-between gap-2 text-5xl font-medium"
	>
		<div
			class="data-[delayed=true]:animate-timer-delay group flex w-full items-center justify-center font-[Geist] tabular-nums tracking-widest duration-500 ease-in-out data-[add=true]:text-primary"
			data-add={timer.isProcessingQueue && timer.beforeTimeUpdate.ms > 0}
			data-subtract={timer.isProcessingQueue && timer.beforeTimeUpdate.ms < 0}
			data-delayed={wheel.isDelayed}
		>
			<Input
				id="timer-hours"
				type="number"
				class={inputStyle}
				disabled={timer.isRunning}
				onConfirmation={(v) => setHours(Number(v))}
				value={paddedHours}
			/>
			:
			<Input
				id="timer-minutes"
				type="number"
				class={inputStyle}
				disabled={timer.isRunning}
				onConfirmation={(v) => setMinutes(Number(v))}
				value={paddedMinutes}
			/>
			:
			<Input
				id="timer-seconds"
				type="number"
				class={inputStyle}
				disabled={timer.isRunning}
				onConfirmation={(v) => setSeconds(Number(v))}
				value={paddedSeconds}
			/>
			<span
				class="group-data-[delayed=true]:animate-timer-delay w-[2rem] self-end text-xl leading-8 text-muted-foreground duration-500 ease-in-out group-data-[add=true]:text-primary group-data-[delayed=true]:text-[crimson]"
			>
				{paddedMs}
			</span>
		</div>

		{#if wheel.isActive}
			<div
				class="flex h-10 w-full items-center justify-center text-sm font-medium text-muted-foreground"
			>
				{#if wheel.isSpinning || wheel.isPreparing}
					<div class="flex items-center">Крутим колесо...</div>
				{:else if wheel.isDelayed}
					<div class="flex items-center">Задержка...</div>
				{/if}
			</div>
		{:else}
			<div class="flex w-full">
				<Button
					variant="ghost"
					size="icon"
					class="w-full active:scale-90"
					onclick={() => timer.reset()}
					disabled={timer.target === timer.baseTime || wheel.isActive}
				>
					<ResetIcon />
				</Button>
				{#if !timer.isActive}
					<Button
						variant="ghost"
						size="icon"
						class="w-full active:scale-90"
						onclick={() => timer.start()}
						disabled={timer.target === 0 || wheel.isActive}
					>
						<PlayIcon />
					</Button>
				{:else}
					<Button
						variant="ghost"
						size="icon"
						class="w-full active:scale-90"
						disabled={timer.isProcessingQueue || wheel.isActive}
						onclick={() => timer.pause()}
					>
						<PauseIcon />
					</Button>
				{/if}
				<Button
					variant="ghost"
					size="icon"
					disabled={wheel.isActive}
					class="w-full active:scale-90"
					onclick={() => timer.subtract()}
				>
					<MinusIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="w-full active:scale-90"
					disabled={wheel.isActive}
					onclick={() => timer.add()}
				>
					<PlusIcon />
				</Button>
			</div>
		{/if}
	</div>
</div>
