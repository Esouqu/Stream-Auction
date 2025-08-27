<script lang="ts">
	import type { Editor } from 'svelte-tiptap';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import HighlighterIcon from '@lucide/svelte/icons/highlighter';
	import MenuButton from './MenuButton.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import Color from 'color';

	interface Props {
		editor: Editor;
		class?: string;
	}

	const { editor, class: className }: Props = $props();

	let textColor = $derived(Color(editor.getAttributes('textStyle').color || '#ffffff').hex());
	let highlightColor = $derived(editor.getAttributes('highlight').color || '#ffffff');
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

	function setHighlightColor(value: string) {
		editor
			?.chain()
			.setHighlight({ color: value || '#ffffff' })
			.run();
	}

	function setTextColor(value: string) {
		const newColor = value ? Color(value).hex() : '#ffffff';
		editor?.chain().setColor(newColor).run();
	}
</script>

<div class={className}>
	{#each editorButtons as { Icon, pressed, onclick }}
		<MenuButton {Icon} {pressed} {onclick} />
	{/each}
	<ColorPicker
		id="text-editor-text-color"
		colorIndicator={textColor}
		bind:color={() => textColor, setTextColor}
	>
		A
	</ColorPicker>
	<ColorPicker
		id="text-editor-highlight-color"
		colorIndicator={highlightColor}
		bind:color={() => highlightColor, setHighlightColor}
	>
		<HighlighterIcon />
	</ColorPicker>
</div>
