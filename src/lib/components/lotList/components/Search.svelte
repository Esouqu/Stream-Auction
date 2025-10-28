<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Toggle } from '$lib/components/ui/toggle';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { slide } from 'svelte/transition';

	type Props = {
		value?: string;
	};

	let { value = $bindable('') }: Props = $props();

	let isSearchVisible = $state(false);
	let searchInputRef: HTMLInputElement | null = $state(null);

	let searchTimeout: NodeJS.Timeout;

	$effect(() => {
		if (isSearchVisible) {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => searchInputRef?.focus(), 200);
		} else {
			value = '';
		}
	});
</script>

<div class="flex">
	<div class="py-1.5">
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Toggle
						{...props}
						class="left-2 rounded-full data-[state=off]:text-foreground"
						variant="ghost"
						size="icon"
						bind:pressed={isSearchVisible}
					>
						<SearchIcon />
					</Toggle>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent>Поиск</TooltipContent>
		</Tooltip>
	</div>

	{#if isSearchVisible}
		<div class="p-1.5" transition:slide={{ axis: 'x' }}>
			<Input
				id="search"
				type="text"
				class="w-[248px] shrink-0 rounded-full border-none"
				placeholder="Название"
				onConfirmation={() => (!value ? (isSearchVisible = false) : null)}
				bind:ref={searchInputRef}
				bind:value
			/>
		</div>
	{/if}
</div>
