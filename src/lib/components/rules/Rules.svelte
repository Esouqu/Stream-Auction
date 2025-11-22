<script lang="ts">
	import { onMount } from 'svelte';
	import HeadingSelector from './components/HeadingSelector.svelte';
	import TextAlignSelector from './components/TextAlignSelector.svelte';
	import type { Readable } from 'svelte/store';
	import { BubbleMenu, createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { Skeleton } from '../ui/skeleton';
	import TextResizer from './components/TextResizer.svelte';
	import FormattingToggles from './components/FormattingToggles.svelte';
	import PresetSelector from './components/PresetSelector.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Color from '@tiptap/extension-color';
	import TextAlign from '@tiptap/extension-text-align';
	import TextStyle from '@tiptap/extension-text-style';
	import Highlight from '@tiptap/extension-highlight';
	import { FontSize } from '$lib/misc/FontSize';
	import ColorPickers from './components/ColorPickers.svelte';
	import OtherActions from './components/OtherActions.svelte';
	import { ScrollArea } from '../ui/scroll-area';

	const editorStyles =
		'h-full w-full border-transparent p-4 text-base text-foreground disabled:cursor-not-allowed disabled:opacity-50 [&_p]:min-w-1 prose lg:prose-xl prose-invert transition-colors [&_*]:leading-normal focus-visible:z-50 rounded-lg focus-visible:bg-elevation-1 focus-visible:outline-input/30 border-0 outline-[2px] outline-transparent';
	const tipTapConfig = {
		editorProps: {
			attributes: {
				class: editorStyles
			}
		},
		extensions: [
			StarterKit,
			Underline,
			Color,
			TextStyle,
			Highlight.configure({ multicolor: true, HTMLAttributes: { class: 'mark' } }),
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			FontSize
		]
	};

	let editor: Readable<Editor> | undefined = $state();

	onMount(() => {
		editor = createEditor(tipTapConfig);
	});
</script>

<div class="relative flex w-full flex-col rounded-xl bg-card/40">
	{#if $editor}
		<ScrollArea class="relative h-full">
			<EditorContent editor={$editor} class="relative z-20 flex size-full p-0.5" />
			{#if $editor.isFocused}
				<div class="border-animation rounded-xl"></div>
			{/if}
		</ScrollArea>
		<PresetSelector editor={$editor} />

		<BubbleMenu
			editor={$editor}
			class="z-50 grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center rounded-lg border bg-popover shadow-md"
			updateDelay={300}
			tippyOptions={{
				moveTransition: 'transform 0.3s ease-in-out',
				maxWidth: 'fit-content'
			}}
		>
			<HeadingSelector editor={$editor} class="flex border-b p-1" />
			<TextAlignSelector editor={$editor} class="flex border-r border-b border-l p-1" />
			<TextResizer editor={$editor} class="flex gap-1 border-b p-1" />
			<div class="col-span-3 flex justify-self-center p-1">
				<FormattingToggles editor={$editor} />
				<ColorPickers editor={$editor} />
				<OtherActions editor={$editor} />
			</div>
		</BubbleMenu>
	{:else}
		<div class="flex flex-col space-y-2 p-4">
			{#each { length: 5 } as _}
				<Skeleton class="h-5 w-1/3"></Skeleton>
				<Skeleton class="h-5 w-full"></Skeleton>
				<Skeleton class="h-5 w-2/3"></Skeleton>
				<Skeleton class="h-5 w-full"></Skeleton>
				<Skeleton class="h-5 w-1/2"></Skeleton>
			{/each}
		</div>
	{/if}
</div>
