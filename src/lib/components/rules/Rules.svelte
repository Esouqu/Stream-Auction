<script lang="ts">
	import { onMount } from 'svelte';
	import HeadingSelector from './components/HeadingSelector.svelte';
	import TextAlignSelector from './components/TextAlignSelector.svelte';
	import type { Readable } from 'svelte/store';
	import { BubbleMenu, createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { Skeleton } from '../ui/skeleton';
	import { fade } from 'svelte/transition';
	import ShortcutTooltip from './components/ShortcutTooltip.svelte';
	import TextResizer from './components/TextResizer.svelte';
	import FormattingToggles from './components/FormattingToggles.svelte';
	import OtherActions from './components/OtherActions.svelte';
	import PresetSelector from './components/PresetSelector.svelte';
	import { ScrollArea } from '../ui/scroll-area';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Color from '@tiptap/extension-color';
	import TextAlign from '@tiptap/extension-text-align';
	import TextStyle from '@tiptap/extension-text-style';
	import Highlight from '@tiptap/extension-highlight';
	import { FontSize } from '$lib/misc/FontSize';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	const editorStyles =
		'h-full w-full ring-offset-background outline-none border border-transparent p-4 text-base text-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&_p]:min-w-1 prose lg:prose-xl prose-invert transition-colors [&_*]:leading-normal focus-visible:z-50 focus-visible:border-primary rounded-lg';
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

	const { background } = getAppManagerContext();

	let editor = $state() as Readable<Editor> | undefined;

	onMount(() => {
		editor = createEditor(tipTapConfig);
	});
</script>

<div
	class="relative flex w-full flex-col rounded-md border bg-card"
	style="--tw-bg-opacity: {background.floatDimness}; --tw-border-opacity: {background.floatDimness};"
>
	{#if $editor}
		<ScrollArea class="h-full">
			<EditorContent editor={$editor} class="relative flex h-full w-full" />
		</ScrollArea>
		<PresetSelector editor={$editor} />

		<BubbleMenu
			editor={$editor}
			class="z-50 grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center rounded border bg-popover shadow-md"
			updateDelay={300}
			tippyOptions={{ moveTransition: 'transform 0.3s ease-in-out', maxWidth: 'fit-content' }}
		>
			<HeadingSelector editor={$editor} class="flex gap-0.5 border-b p-1 pr-2" />
			<TextAlignSelector
				editor={$editor}
				class="flex gap-0.5 border-b border-l border-r p-1 px-2"
			/>
			<TextResizer editor={$editor} class="flex gap-0.5 border-b p-1 pl-2" />
			<FormattingToggles
				editor={$editor}
				class="col-span-2 flex gap-0.5 justify-self-end border-r p-1 pr-2"
			/>
			<OtherActions editor={$editor} class="flex gap-0.5 p-1 pl-2" />
		</BubbleMenu>
		{#if $editor.isFocused}
			<div class="absolute bottom-20 left-4 w-[calc(100%-2rem)]" transition:fade>
				<ShortcutTooltip />
			</div>
		{/if}
	{:else}
		<div class="flex flex-col space-y-2 p-4">
			{#each { length: 5 } as _}
				<Skeleton class="h-5 w-1/3 animate-pulse rounded-md bg-muted"></Skeleton>
				<Skeleton class="h-5 w-full animate-pulse rounded-md bg-muted"></Skeleton>
				<Skeleton class="h-5 w-2/3 animate-pulse rounded-md bg-muted"></Skeleton>
				<Skeleton class="h-5 w-full animate-pulse rounded-md bg-muted"></Skeleton>
				<Skeleton class="h-5 w-1/2 animate-pulse rounded-md bg-muted"></Skeleton>
			{/each}
		</div>
	{/if}
</div>
