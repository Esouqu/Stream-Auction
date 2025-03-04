<script lang="ts" module>
	export interface ISelectItem {
		value: string | number;
		label?: string;
		Icon?: typeof CheckIcon;
		disabled?: boolean;
		onclick?: () => void;
		onSelect?: () => void;
	}
</script>

<script lang="ts">
	import CheckIcon from 'lucide-svelte/icons/check';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { Command, CommandItem, CommandList } from '$lib/components/ui/command';
	import { type Snippet } from 'svelte';
	import { ScrollArea } from './ui/scroll-area';

	interface Props {
		items: ISelectItem[];
		open?: boolean;
		selectedValue?: string | number;
		class?: string;
		trigger: Snippet;
		footer?: Snippet;
	}

	let {
		items,
		open = $bindable(false),
		selectedValue = $bindable(items[0].value),
		class: className,
		trigger,
		footer
	}: Props = $props();

	let triggerRef: HTMLButtonElement | null = $state(null);
</script>

<Popover bind:open>
	<PopoverTrigger
		bind:ref={triggerRef}
		class={cn(
			buttonVariants({ variant: 'ghost', size: 'default' }),
			`min-w-fit cursor-default`,
			className
		)}
	>
		{@render trigger()}
	</PopoverTrigger>
	{#if triggerRef}
		<PopoverContent
			class="w-fit p-0 shadow-md"
			portalProps={{ to: triggerRef }}
			onInteractOutside={() => (open = false)}
			hideWhenDetached
			align="start"
		>
			<Command>
				<ScrollArea>
					<CommandList>
						{#each items as { value, label, Icon, disabled, onclick, onSelect }}
							<CommandItem
								{disabled}
								class="rounded-none pr-7"
								value={value.toString()}
								onSelect={() => {
									selectedValue = value;
									onSelect?.();
									// closeAndFocusTrigger();
								}}
								{onclick}
							>
								<CheckIcon class={cn(value !== selectedValue && 'text-transparent')} />
								{#if label}
									{label}
								{:else if Icon}
									<Icon />
								{/if}
							</CommandItem>
						{/each}

						{#if footer}
							<CommandItem class="rounded-none">
								{@render footer?.()}
							</CommandItem>
						{/if}
					</CommandList>
				</ScrollArea>
			</Command>
		</PopoverContent>
	{/if}
</Popover>
