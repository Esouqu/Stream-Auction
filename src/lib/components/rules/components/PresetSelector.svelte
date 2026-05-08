<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount, untrack } from 'svelte';
	import type { Editor } from 'svelte-tiptap';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Input } from '$lib/components/ui/input';

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

<div class="relative flex w-full">
	<div class="absolute top-1/2 right-14 left-0 z-50 flex -translate-y-1/2 items-center pl-2">
		<Input
			id="preset-name"
			type="text"
			variant="ghost"
			placeholder="Название"
			class="w-full rounded-r-none"
			borderClass="!rounded-r-none"
			bind:ref={nameInputRef}
			bind:value={rulePresets.items[rulePresets.current].label}
		/>
	</div>
	<Select
		type="single"
		value={String(rulePresets.current)}
		onValueChange={changePresetSelection}
		bind:open={isSelectOpen}
	>
		<SelectTrigger class="w-full justify-end" />
		<SelectContent side="top">
			{#each rulePresets.items as { id, label }, idx (id)}
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
			<Button variant="ghost" class="mt-1 w-full text-muted-foreground" onclick={createPreset}>
				<PlusIcon />
				Новые правила
			</Button>
		</SelectContent>
	</Select>
</div>
