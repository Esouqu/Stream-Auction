<script lang="ts">
	import { Button } from './ui/button';
	import PlayIcon from '@lucide/svelte/icons/play';
	import PauseIcon from '@lucide/svelte/icons/pause';
	import ResetIcon from '@lucide/svelte/icons/timer-reset';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import Input from './Input.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { fade } from 'svelte/transition';

	const inputStyle =
		'h-[4rem] leading-none border-none p-0 text-center tabular-nums read-only:hover:bg-transparent read-only:focus-visible:ring-transparent w-[6.25rem] md:text-7xl disabled:opacity-100 disabled:cursor-default transition-none hover:bg-white/10';

	const { timer, wheel } = getAppManagerContext();

	const { minutes, seconds, ms } = $derived(timer.formattedTime);
	const paddedMinutes = $derived(timeToString(minutes));
	const paddedSeconds = $derived(timeToString(seconds));
	const paddedMs = $derived(timeToString(ms));
	const isInputDisabled = $derived(timer.current !== timer.target || timer.isRunning);

	let minusCounter = $state(0);
	let plusCounter = $state(0);
	let timeoutId: number | null = null;

	$effect(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (plusCounter > 0 || minusCounter > 0) {
			timeoutId = window.setTimeout(() => {
				plusCounter = 0;
				minusCounter = 0;
			}, 500);
		}
	});

	function onMinusClick() {
		timer.subtract();
		minusCounter++;
	}

	function onPlusClick() {
		timer.add();
		plusCounter++;
	}

	function setSeconds(value: number) {
		timer.setSeconds(value);
		timer.setMilliseconds(0);
	}

	function setMinutes(value: number) {
		timer.setMinutes(value);
	}

	function timeToString(num: number) {
		return String(num).padStart(2, '0');
	}
</script>

<div
	class="relative flex w-full shrink-0 flex-col items-center overflow-hidden rounded-xl bg-card/40 p-4"
>
	<div
		class="transition-color relative flex w-fit flex-col items-center justify-between gap-2 text-7xl font-medium"
	>
		<div
			class="group flex w-full items-center justify-center font-[Red_Hat_Display] font-semibold tracking-widest duration-500 ease-in-out data-[add=true]:text-green-400 data-[delayed=true]:animate-timer-delay data-[subtract=true]:text-red-400"
			data-add={timer.isProcessingQueue && timer.beforeTimeUpdate.ms > 0}
			data-subtract={timer.isProcessingQueue && timer.beforeTimeUpdate.ms < 0}
			data-delayed={wheel.isDelayed}
		>
			<Input
				id="timer-min"
				type="number"
				class={inputStyle}
				disabled={isInputDisabled}
				onConfirmation={(v) => setMinutes(Number(v))}
				value={paddedMinutes}
			/>
			:
			<Input
				id="timer-sec"
				type="number"
				class={inputStyle}
				disabled={isInputDisabled}
				onConfirmation={(v) => setSeconds(Number(v))}
				value={paddedSeconds}
			/>
			:
			<Input id="timer-ms" type="number" class={inputStyle} disabled value={paddedMs} />
		</div>

		{#if wheel.isActive}
			<div
				class="flex h-10 w-full items-center justify-center text-base font-medium text-muted-foreground"
			>
				{#if wheel.isSpinning || wheel.isPreparing}
					<div class="flex items-center">Кручение колеса...</div>
				{:else if wheel.isDelayed}
					<div class="flex items-center">Задержка...</div>
				{/if}
			</div>
		{:else}
			<div class="flex w-full">
				<Button
					variant="ghost"
					size="icon"
					class="w-full shrink"
					onclick={() => timer.reset()}
					disabled={timer.target === timer.baseTime || wheel.isActive}
				>
					<ResetIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="w-full shrink"
					onclick={() => (timer.isActive ? timer.pause() : timer.start())}
					disabled={timer.isActive
						? timer.isProcessingQueue || wheel.isActive
						: timer.target === 0 || wheel.isActive}
				>
					{#if timer.isActive}
						<PauseIcon />
					{:else}
						<PlayIcon />
					{/if}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					disabled={wheel.isActive}
					class="relative w-full shrink text-base"
					onclick={onMinusClick}
				>
					<MinusIcon />
					{#if minusCounter > 0}
						<div class="absolute right-2 bottom-0 tabular-nums" transition:fade={{ duration: 200 }}>
							{minusCounter}
						</div>
					{/if}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="relative w-full shrink text-base"
					disabled={wheel.isActive}
					onclick={onPlusClick}
				>
					<PlusIcon />
					{#if plusCounter > 0}
						<div class="absolute right-2 bottom-0 tabular-nums" transition:fade={{ duration: 200 }}>
							{plusCounter}
						</div>
					{/if}
				</Button>
			</div>
		{/if}
	</div>
</div>
