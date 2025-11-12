<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const inputVariants = tv({
		base: 'flex h-10 w-full min-w-0 rounded-full border-0 outline-[2px] outline-transparent border-transparent px-3 py-2 pl-4 text-base transition-all duration-300 selection:bg-accent selection:text-accent-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
		variants: {
			variant: {
				default:
					'focus-visible:bg-elevation-1 outline-input focus-visible:outline-input hover:outline-neutral-500',
				ghost: 'hover:bg-white/10 focus-visible:outline-input focus-visible:bg-elevation-1'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type InputVariant = VariantProps<typeof inputVariants>['variant'];
	export type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	export type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	> & {
		gradientColor?: string;
		borderClass?: string;
		variant?: InputVariant;
		suffix?: string;
		suffixSize?: 'sm' | 'md';
		onenter?: () => void;
	};
</script>

<script lang="ts">
	let {
		ref = $bindable(null),
		value = $bindable(),
		variant = 'default',
		gradientColor = 'var(--color-accent)',
		type,
		files = $bindable(),
		class: className,
		borderClass,
		suffix,
		suffixSize,
		onenter,
		onkeydown,
		onfocus,
		onblur,
		...restProps
	}: Props = $props();

	let isFocused = $state(false);

	function onFocus(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		isFocused = true;
		onfocus?.(e);
	}

	function onBlur(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		isFocused = false;
		onblur?.(e);
	}

	function onKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.key === 'Enter') {
			onenter?.();
			ref?.blur();
		}

		onkeydown?.(e);
	}
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(inputVariants({ variant }), className)}
		type="file"
		bind:files
		bind:value
		onkeydown={onKeyDown}
		{...restProps}
	/>
{:else}
	<div
		class="relative flex size-fit overflow-hidden"
		class:w-full={className?.includes('w-full')}
		class:size-full={className?.includes('size-full')}
	>
		<div class="relative z-20 flex w-full p-0.5">
			<input
				bind:this={ref}
				data-slot="input"
				class={cn(inputVariants({ variant }), className)}
				{type}
				bind:value
				onkeydown={onKeyDown}
				onfocus={onFocus}
				onblur={onBlur}
				{...restProps}
			/>
		</div>

		{#if suffix}
			<span
				class="pointer-events-none absolute top-1/2 right-3 z-20 -translate-y-1/2 text-muted-foreground data-[suffix-size=sm]:right-3 data-[suffix-size=sm]:text-sm"
				data-suffix-size={suffixSize}
			>
				{suffix}
			</span>
		{/if}

		{#if isFocused}
			<div
				class={cn('border-animation', borderClass)}
				style="--grad-main-color: {gradientColor};"
			></div>
		{/if}
	</div>
{/if}
