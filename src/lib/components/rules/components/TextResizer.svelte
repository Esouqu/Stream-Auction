<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import type { Editor } from 'svelte-tiptap';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		editor: Editor;
		class?: string;
	}

	const incrementValue = 2;

	const { editor, class: className }: Props = $props();

	let fontSize = $derived.by(parseFontSize);

	function setFontSize(size: number) {
		const sizeInPx = `${size}px`;

		editor.chain().focus().setFontSize(sizeInPx).run();
	}

	function parseFontSize() {
		const textStyle = editor.getAttributes('textStyle').fontSize;
		const parsedValue = parseInt(textStyle, 10); // might be NaN

		return parsedValue || 16;
	}
</script>

<div class={className}>
	<Button
		variant="ghost"
		size="icon"
		class="hover:bg-white/10"
		onclick={() => setFontSize(fontSize - incrementValue)}
	>
		<MinusIcon />
	</Button>
	<Input
		id="editor-menu-text-size"
		type="number"
		class="w-[56px] bg-transparent text-center hover:bg-white/10"
		value={fontSize}
		onblur={(e) => setFontSize(Number(e.currentTarget.value))}
	/>
	<Button
		variant="ghost"
		size="icon"
		class="hover:bg-white/10"
		onclick={() => setFontSize(fontSize + incrementValue)}
	>
		<PlusIcon />
	</Button>
</div>
