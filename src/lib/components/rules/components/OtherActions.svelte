<script lang="ts">
	import SeparatorIcon from 'lucide-svelte/icons/separator-horizontal';
	import RemoveFormattingIcon from 'lucide-svelte/icons/remove-formatting';
	import type { Editor } from 'svelte-tiptap';
	import MenuButton from './MenuButton.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';

	interface Props {
		editor: Editor;
		class?: string;
	}

	const { editor, class: className }: Props = $props();

	const buttons = [
		{
			tooltip: 'Разделитель',
			Icon: SeparatorIcon,
			onclick: () => editor.chain().focus().setHorizontalRule().run()
		},
		{
			tooltip: 'Очистить форматирование',
			Icon: RemoveFormattingIcon,
			onclick: () => editor.chain().focus().unsetAllMarks().run()
		}
	];
</script>

<div class={className}>
	{#each buttons as { Icon, tooltip, onclick }}
		<Tooltip>
			<TooltipTrigger>
				<MenuButton {Icon} {onclick} />
			</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	{/each}
</div>
