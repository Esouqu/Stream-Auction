<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 pt-1.5 font-medium ring-offset-background transition-[colors,box-shadow] outline-none selection:bg-accent selection:text-accent-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'flex h-10 w-full min-w-0 rounded-md border border-input bg-white/0 px-3 py-2 text-base ring-offset-background transition-colors outline-none selection:bg-accent selection:text-accent-foreground placeholder:text-muted-foreground hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50',
			'focus-visible:border-accent focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-accent/50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
