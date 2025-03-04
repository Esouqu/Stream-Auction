<script lang="ts" module>
	export interface IDropdownItem extends Omit<ISelectItem, 'onSelect'> {}
</script>

<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { Command, CommandItem, CommandList } from '$lib/components/ui/command';
	import type { ISelectItem } from './Select.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		items: IDropdownItem[];
		open?: boolean;
		class?: string;
		trigger: Snippet;
	}

	let { items, open = $bindable(false), class: className, trigger }: Props = $props();

	let triggerRef: HTMLButtonElement | null = $state(null);
</script>

<Popover bind:open>
	<PopoverTrigger
		bind:ref={triggerRef}
		class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-default', className)}
	>
		{@render trigger()}
	</PopoverTrigger>
	<PopoverContent class="w-fit p-0" hideWhenDetached onInteractOutside={() => (open = false)}>
		<Command>
			<CommandList>
				{#each items as { value, label, Icon, disabled, onclick }}
					<CommandItem
						class="rounded-none pr-7"
						value={value.toString()}
						{disabled}
						onclick={() => {
							open = false;
							onclick?.();
						}}
					>
						{#if Icon}
							<Icon />
						{/if}
						{#if label}
							{label}
						{/if}
					</CommandItem>
				{/each}
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
