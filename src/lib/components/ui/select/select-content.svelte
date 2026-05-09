<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import SelectScrollUpButton from './select-scroll-up-button.svelte';
	import SelectScrollDownButton from './select-scroll-down-button.svelte';
	import { cn, type WithoutChild } from '$lib/utils.js';
	import { fade, slide } from 'svelte/transition';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 0,
		portalProps,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: SelectPrimitive.PortalProps;
	} = $props();
</script>

<SelectPrimitive.Portal {...portalProps}>
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		data-slot="select-content"
		class={cn(
			'relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl rounded-b-none text-popover-foreground',
			'border border-input/15 bg-stone-700/40 backdrop-blur-md',
			className
		)}
		forceMount
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps} in:slide|global out:fade|global={{ duration: 250 }}>
					<div {...props}>
						<SelectScrollUpButton />
						<SelectPrimitive.Viewport
							class={cn(
								'h-(--bits-select-anchor-height) w-full min-w-[calc(var(--bits-select-anchor-width)-2px)] scroll-my-1 p-1'
							)}
						>
							{@render children?.()}
						</SelectPrimitive.Viewport>
						<SelectScrollDownButton />
					</div>
				</div>
			{/if}
		{/snippet}
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
