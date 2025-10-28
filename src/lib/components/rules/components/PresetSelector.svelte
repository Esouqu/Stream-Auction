<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount, untrack } from 'svelte';
	import type { Editor } from 'svelte-tiptap';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import BlurPanel from '$lib/components/BlurPanel.svelte';

	interface Props {
		editor: Editor;
	}

	const { editor }: Props = $props();

	let { rulePresets } = getAppManagerContext();
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

<div class="relative flex items-center p-4">
	<BlurPanel class="flex w-full">
		<Input
			id="preset-name"
			type="text"
			placeholder="Название"
			class="rounded-l-full rounded-r-none border-none border-transparent hover:bg-white/10"
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
					'rounded-l-none rounded-r-full border-none'
				)}
			/>
			<SelectContent class="w-[366px]" align="end">
				{#each rulePresets.items as { label }, idx}
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
				<Button
					variant="ghost"
					size="icon"
					class="mt-1 w-full text-muted-foreground"
					onclick={createPreset}
				>
					<PlusIcon />
					Новые правила
				</Button>
			</SelectContent>
		</Select>
	</BlurPanel>
</div>
