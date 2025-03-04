<script lang="ts">
	import { Input } from './ui/input';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		id: string;
		suffix?: string;
		class?: string;
		value?: string | number | null;
		ref?: HTMLElement | null | undefined;
		onConfirmation?: ((value: number | string | null) => void) | null;
	}

	let {
		type,
		suffix,
		class: className,
		value = $bindable(type === 'number' ? null : ''),
		ref = $bindable(null),
		onConfirmation,
		...restProps
	}: Props = $props();

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			ref?.blur();
		}
	}

	function onblur() {
		onConfirmation?.(value);
	}
</script>

{#if suffix}
	<div class="relative h-fit w-full">
		<Input bind:ref class={className} {type} bind:value {onkeydown} {onblur} {...restProps} />
		<span
			class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
		>
			{suffix}
		</span>
	</div>
{:else}
	<Input bind:ref class={className} {type} bind:value {onkeydown} {onblur} {...restProps} />
{/if}
