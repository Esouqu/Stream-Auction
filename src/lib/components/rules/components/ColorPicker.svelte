<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		color?: string;
		colorIndicator?: string;
		children: Snippet;
	}

	let { id, color = $bindable('#ffffff'), colorIndicator, children }: Props = $props();
</script>

<div
	class={cn(
		buttonVariants({ variant: 'ghost', size: 'icon' }),
		'relative flex flex-col items-center justify-center p-0 hover:bg-white/10'
	)}
>
	<div class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		{@render children()}
	</div>
	<div class="relative flex h-full w-full">
		{#if colorIndicator}
			<div
				class="absolute bottom-1 left-1/2 h-1 w-2/4 -translate-x-1/2 rounded"
				style="background-color: {colorIndicator};"
			></div>
		{/if}
		<Input
			{id}
			type="color"
			class="h-full w-full cursor-pointer border-none p-0 opacity-0"
			bind:value={color}
		/>
	</div>
</div>
