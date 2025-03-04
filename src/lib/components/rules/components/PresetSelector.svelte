<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import XIcon from 'lucide-svelte/icons/x';
	import { onMount, untrack } from 'svelte';
	import type { Editor } from 'svelte-tiptap';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let { rulePresets, background } = getAppManagerContext();
	let nameInputRef: HTMLInputElement | null = $state(null);
	let isSelectOpen = $state(false);

	onMount(() => {
		editor.commands.setContent(rulePresets.currentItem.content);
		editor.on('transaction', () => {
			const json = editor.getJSON();
			rulePresets.currentItem.content = json;
		});
	});

	$effect(() => {
		rulePresets.current;

		untrack(() => {
			editor?.commands.setContent(rulePresets.currentItem.content);
		});
	});

	function deletePreset(id: number) {
		rulePresets.remove(id);
	}

	function createPreset() {
		isSelectOpen = false;
		rulePresets.create();
		nameInputRef?.focus();
	}

	function changePresetSelection(value: string) {
		rulePresets.setCurrent(Number(value));
	}
</script>

<div
	class="relative flex items-center border-t bg-secondary px-4 py-2"
	style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
>
	<div class="flex w-full rounded-md border">
		<Input
			id="preset-name"
			type="text"
			placeholder="Название"
			class="rounded-br-none rounded-tr-none border-transparent hover:bg-muted focus-visible:bg-transparent"
			bind:ref={nameInputRef}
			bind:value={rulePresets.items[rulePresets.current].label}
		/>
		<Select
			type="single"
			value={String(rulePresets.current)}
			onValueChange={changePresetSelection}
			bind:open={isSelectOpen}
		>
			<SelectTrigger
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'icon' }),
					'rounded-l-none rounded-r-md border-none bg-transparent'
				)}
			/>
			<SelectContent align="end">
				{#each rulePresets.items as { id, label }, idx}
					<div class="flex">
						<SelectItem value={String(idx)} {label} />
						<Button
							variant="ghost"
							size="icon"
							onclick={() => deletePreset(idx)}
							disabled={rulePresets.current === idx}
						>
							<XIcon />
						</Button>
					</div>
				{/each}
				<Button variant="ghost" size="icon" class="mt-1 w-full" onclick={createPreset}>
					<PlusIcon />
				</Button>
			</SelectContent>
		</Select>
	</div>
</div>
