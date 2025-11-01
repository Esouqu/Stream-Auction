<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: "aria-invalid:ring-destructive/20 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-2 outline-transparent transition-[color,background-color,outline-color] duration-[0.3s,0.3s,0.15s] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer rounded-full",
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary active:outline-primary',
				destructive:
					'bg-destructive text-foreground hover:bg-destructive/90 active:bg-destructive active:outline-destructive',
				outline: 'bg-elevation-2 hover:bg-primary/10 hover:text-accent-foreground border',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost:
					'hover:bg-primary/10 hover:text-foreground active:bg-primary/30 active:outline-primary/30',
				accent:
					'bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 active:outline-accent',
				link: 'text-primary underline-offset-4 hover:underline',
				icon: 'text-muted-foreground hover:text-foreground'
			},
			size: {
				default: 'h-11 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-12 px-6 has-[>svg]:px-4',
				icon: 'size-11',
				sidebar: "[&_svg:not([class*='size-'])]:!size-8 py-1 px-5"
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
