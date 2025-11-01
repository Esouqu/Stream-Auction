<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { slide } from 'svelte/transition';

	type Props = {
		value?: string;
		isInputVisible?: boolean;
	};

	const SLIDE_DURATION = 400;

	let { isInputVisible = $bindable(false), value = $bindable('') }: Props = $props();

	let inputRef: HTMLInputElement | null = $state(null);

	let focusTimeout: NodeJS.Timeout;
	let blurTimeout: NodeJS.Timeout;

	$effect(() => {
		if (isInputVisible) {
			clearTimeout(focusTimeout);
			focusTimeout = setTimeout(() => inputRef?.focus(), SLIDE_DURATION);
		} else {
			value = '';
		}
	});

	function onblur() {
		clearTimeout(blurTimeout);
		blurTimeout = setTimeout(() => {
			if (!value && isInputVisible) {
				isInputVisible = false;
			}
		}, 200);
	}
</script>

<div class="relative flex shrink-0 py-1.5 pl-1.5">
	<Tooltip>
		<TooltipTrigger>
			{#snippet child({ props })}
				<Toggle
					{...props}
					size="icon"
					variant="ghost"
					class="absolute z-10 shrink-0 rounded-full data-[state=off]:text-foreground"
					bind:pressed={isInputVisible}
				>
					<SearchIcon />
				</Toggle>
			{/snippet}
		</TooltipTrigger>
		<TooltipContent>Поиск</TooltipContent>
	</Tooltip>

	{#if isInputVisible}
		<div class="pr-1.5" transition:slide={{ axis: 'x', duration: SLIDE_DURATION }}>
			<Input
				id="search"
				type="text"
				class="w-full rounded-full border-none pl-10"
				placeholder="Название"
				onConfirmation={onblur}
				bind:ref={inputRef}
				bind:value
			/>
		</div>
	{/if}
</div>
