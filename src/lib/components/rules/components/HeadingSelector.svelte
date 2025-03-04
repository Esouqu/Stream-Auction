<script lang="ts">
	import ListOrderedIcon from 'lucide-svelte/icons/list-ordered';
	import ListIcon from 'lucide-svelte/icons/list';
	import Select, { type ISelectItem } from '$lib/components/Select.svelte';
	import HeadingIcon from 'lucide-svelte/icons/heading';
	import type { Editor } from 'svelte-tiptap';
	import MenuButton from './MenuButton.svelte';
	import ChevronDownIcon from 'lucide-svelte/icons/chevron-down';

	type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

	interface Props {
		editor: Editor;
		class?: string;
	}

	let { editor, class: className }: Props = $props();

	const selectedHeading = $derived.by(getSelectedHeading);

	const items: ISelectItem[] = $derived.by(() => [
		{
			value: 'p',
			label: 'Обычный',
			disabled: editor?.isActive('paragraph'),
			onclick: () => {
				editor.commands.unsetFontSize();
				editor.chain().focus().setParagraph().run();
			}
		},
		...generateHeadingItems(3)
	]);

	const listToggles = $derived([
		{
			Icon: ListIcon,
			onclick: () => {
				editor.commands.unsetFontSize();
				editor.chain().focus().toggleBulletList().run();
			},
			pressed: editor.isActive('bulletList')
		},
		{
			Icon: ListOrderedIcon,
			onclick: () => {
				editor.commands.unsetFontSize();
				editor.chain().focus().toggleOrderedList().run();
			},
			pressed: editor.isActive('orderedList')
		}
	]);

	function generateHeadingItems(maxLevel: HeadingLevel) {
		const h1 = '39.2px';
		const h2 = '25.2px';
		const h3 = '21px';

		return Array.from({ length: maxLevel }).map((_, i) => {
			const level = (i + 1) as HeadingLevel;

			return {
				value: level,
				label: `H${level}`,
				disabled: editor.isActive('heading', { level }),
				onclick: () => {
					const fontSize = level === 1 ? h1 : level === 2 ? h2 : h3;
					editor.chain().focus().toggleHeading({ level }).setFontSize(fontSize).run();
				}
			} as ISelectItem;
		});
	}

	function getSelectedHeading() {
		return (
			items.find((item) => editor?.isActive('heading', { level: item.value })) || {
				value: 'p',
				label: 'Обычный'
			}
		);
	}
</script>

<div class={className}>
	<Select {items} selectedValue={selectedHeading.value} class="hover:bg-white/10">
		{#snippet trigger()}
			<div class="flex w-full justify-between">
				<HeadingIcon />
				<ChevronDownIcon />
			</div>
		{/snippet}
	</Select>
	{#each listToggles as { Icon, onclick, pressed }}
		<MenuButton {Icon} {onclick} {pressed} />
	{/each}
</div>
