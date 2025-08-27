<script lang="ts">
	import { Input } from './ui/input';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		id: string;
		type: 'file' | Exclude<HTMLInputTypeAttribute, 'file'>;
		suffix?: string;
		class?: string;
		style?: string;
		value?: string | number | null;
		ref?: HTMLElement | null | undefined;
		onenter?: () => void;
		onConfirmation?: ((value: number | string | null) => void) | null;
	}

	let {
		id,
		type,
		suffix,
		class: className,
		style,
		value = $bindable(type === 'number' ? null : ''),
		ref = $bindable(null),
		disabled,
		placeholder,
		onenter,
		onConfirmation
	}: Props = $props();

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onenter?.();
			ref?.blur();
		}
	}

	function onblur() {
		onConfirmation?.(value);
	}
</script>

{#if suffix}
	<div class="relative h-fit w-fit">
		<Input
			{id}
			bind:ref
			class={className}
			bind:value
			{onkeydown}
			{onblur}
			{style}
			{type}
			{disabled}
			{placeholder}
		/>
		<span
			class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
		>
			{suffix}
		</span>
	</div>
{:else}
	<Input
		{id}
		bind:ref
		class={className}
		bind:value
		{onkeydown}
		{onblur}
		{style}
		{type}
		{disabled}
		{placeholder}
	/>
{/if}
