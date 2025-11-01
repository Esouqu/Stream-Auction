<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const toggleVariants = tv({
		base: "data-[state=off]:text-muted-foreground data-[state=on]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-2 outline-transparent transition-all duration-300 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer transition-colors",
		variants: {
			variant: {
				default: 'bg-transparent hover:text-foreground',
				ghost:
					'hover:bg-primary/10 hover:text-foreground active:bg-primary/30 active:outline-primary/30 data-[state=off]:hover:text-foreground',
				outline:
					'border-input shadow-xs hover:bg-accent hover:text-accent-foreground border bg-transparent',
				filled:
					'bg-accent hover:bg-accent/90 data-[state=off]:text-foreground active:bg-accent active:outline-accent'
			},
			size: {
				default: 'h-11 px-4 py-2',
				sm: 'h-8 min-w-8 px-1.5',
				lg: 'h-11 min-w-11 px-2.5',
				icon: 'size-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ToggleVariant = VariantProps<typeof toggleVariants>['variant'];
	export type ToggleSize = VariantProps<typeof toggleVariants>['size'];
	export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = 'default',
		variant = 'default',
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root
	bind:ref
	bind:pressed
	data-slot="toggle"
	class={cn(toggleVariants({ variant, size }), className)}
	{...restProps}
/>
