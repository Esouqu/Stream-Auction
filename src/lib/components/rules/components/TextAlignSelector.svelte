<script lang="ts">
	import AlignLeftIcon from '@lucide/svelte/icons/align-left';
	import AlignRightIcon from '@lucide/svelte/icons/align-right';
	import AlignCenterIcon from '@lucide/svelte/icons/align-center';
	import AlignJustifyIcon from '@lucide/svelte/icons/align-justify';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import Select, { type ISelectItem } from '$lib/components/Select.svelte';
	import type { Editor } from 'svelte-tiptap';

	interface Props {
		editor: Editor;
		class?: string;
	}

	let { editor, class: className }: Props = $props();

	const selectedTextAlign = $derived.by(getSelectedTextAlign);
	const items: ISelectItem[] = $derived([
		{
			value: 'left',
			Icon: AlignLeftIcon,
			disabled: editor.isActive({ textAlign: 'left' }),
			onclick: () => editor.chain().focus().setTextAlign('left').run()
		},
		{
			value: 'center',
			Icon: AlignCenterIcon,
			disabled: editor.isActive({ textAlign: 'center' }),
			onclick: () => editor.chain().focus().setTextAlign('center').run()
		},
		{
			value: 'right',
			Icon: AlignRightIcon,
			disabled: editor.isActive({ textAlign: 'right' }),
			onclick: () => editor.chain().focus().setTextAlign('right').run()
		},
		{
			value: 'justify',
			Icon: AlignJustifyIcon,
			disabled: editor.isActive({ textAlign: 'justify' }),
			onclick: () => editor.chain().focus().setTextAlign('justify').run()
		}
	]);

	function getSelectedTextAlign() {
		return items.find((item) => editor?.isActive({ textAlign: item.value })) || items[0];
	}
</script>

<div class={className}>
	<Select {items} selectedValue={selectedTextAlign?.value} class="hover:bg-white/10">
		{#snippet trigger()}
			{#if selectedTextAlign}
				<div class="flex w-full justify-between">
					<selectedTextAlign.Icon />
					<ChevronDownIcon />
				</div>
			{/if}
		{/snippet}
	</Select>
</div>
