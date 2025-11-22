<script lang="ts">
	import HighlighterIcon from '@lucide/svelte/icons/highlighter';
	import ColorPicker from '../../colorPicker/ColorPicker.svelte';
	import Color from 'color';
	import type { Editor } from 'svelte-tiptap';

	type Props = {
		editor: Editor;
	};

	const { editor }: Props = $props();

	const textColor = $derived(Color(editor.getAttributes('textStyle').color || '#ffffff').hex());
	const highlightColor = $derived(editor.getAttributes('highlight').color || '#ffffff');

	function setHighlightColor(value: string) {
		if (value === 'transparent') {
			editor?.chain().blur().unsetHighlight().run();
		} else {
			editor?.chain().blur().setHighlight({ color: value }).run();
		}
	}

	function setTextColor(value: string) {
		if (value === 'transparent') {
			editor?.chain().blur().unsetColor().run();
			return;
		}

		const newColor = value ? Color(value).hex() : '#ffffff';
		editor?.chain().blur().setColor(newColor).run();
	}
</script>

<div class="flex">
	<ColorPicker colorIndicator={textColor} bind:color={() => textColor, setTextColor}>A</ColorPicker>
	<ColorPicker colorIndicator={highlightColor} bind:color={() => highlightColor, setHighlightColor}>
		<HighlighterIcon />
	</ColorPicker>
</div>
