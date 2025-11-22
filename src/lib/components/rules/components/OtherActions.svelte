<script lang="ts">
	import SeparatorIcon from '@lucide/svelte/icons/separator-horizontal';
	import RemoveFormattingIcon from '@lucide/svelte/icons/remove-formatting';
	import type { Editor } from 'svelte-tiptap';
	import MenuButton from './MenuButton.svelte';

	interface Props {
		editor: Editor;
		class?: string;
	}

	const { editor, class: className }: Props = $props();

	const buttons = [
		// {
		// 	tooltip: 'Разделитель',
		// 	Icon: SeparatorIcon,
		// 	onclick: () => editor.chain().focus().setHorizontalRule().run()
		// },
		{
			tooltip: 'Очистить форматирование',
			Icon: RemoveFormattingIcon,
			onclick: () => editor.chain().focus().unsetAllMarks().run()
		}
	];
</script>

<div class={className}>
	{#each buttons as { Icon, tooltip, onclick }}
		<MenuButton {Icon} {onclick} {tooltip} />
	{/each}
</div>
