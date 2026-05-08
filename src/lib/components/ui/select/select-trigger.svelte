<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = 'default',
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: 'sm' | 'default';
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		"box-content flex h-11 w-fit cursor-pointer items-center justify-between gap-2 rounded-4xl border border-input/15 px-4.5 py-1.5 font-medium whitespace-nowrap transition-[color,background-color,border-radius] duration-[250ms,250ms,500ms] outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 data-[state=open]:rounded-[0px_0px_24px_24px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='text-'])]:text-muted-foreground",
		'bg-stone-700/40 backdrop-blur-md',
		'hover:bg-primary/10 hover:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon />
</SelectPrimitive.Trigger>
