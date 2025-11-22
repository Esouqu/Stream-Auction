<script lang="ts">
	import type { Editor } from 'svelte-tiptap';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import MenuButton from './MenuButton.svelte';

	interface Props {
		editor: Editor;
		class?: string;
	}

	const { editor, class: className }: Props = $props();

	let editorButtons = $derived([
		{
			Icon: BoldIcon,
			pressed: editor.isActive('bold'),
			onclick: () => editor.chain().focus().toggleBold().run()
		},
		{
			Icon: ItalicIcon,
			pressed: editor.isActive('italic'),
			onclick: () => editor.chain().focus().toggleItalic().run()
		},
		{
			Icon: UnderlineIcon,
			pressed: editor.isActive('underline'),
			onclick: () => editor.chain().focus().toggleUnderline().run()
		}
	]);
</script>

<div class={className}>
	{#each editorButtons as { Icon, pressed, onclick }}
		<MenuButton {Icon} {pressed} {onclick} />
	{/each}
</div>
