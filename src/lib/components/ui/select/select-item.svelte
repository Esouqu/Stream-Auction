<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import Spinner from '$lib/components/Spinner.svelte';

	interface Props {
		loading?: boolean;
	}

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		loading,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> & Props = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if loading}
				<Spinner />
			{:else if selected}
				<Check class="size-4" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp({ selected, highlighted })}
		{:else}
			{label || value}
		{/if}
	{/snippet}
</SelectPrimitive.Item>
