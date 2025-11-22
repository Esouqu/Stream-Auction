<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { type Snippet } from 'svelte';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colors } from '$lib/constants';
	import TextInput from './TextInput.svelte';

	type Props = {
		color?: string;
		colorIndicator?: string;
		children: Snippet;
	};

	let { color = $bindable('#ffffff'), colorIndicator, children }: Props = $props();

	let isOpen = $state(false);
</script>

<div class="relative">
	<Button
		variant="ghost"
		size="icon"
		class="relative flex flex-col items-center justify-center"
		onclick={() => (isOpen = !isOpen)}
	>
		{@render children()}
		{#if colorIndicator}
			<div
				class="pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-2/4 -translate-x-1/2 rounded-full outline outline-input"
				style="background-color: {colorIndicator};"
			></div>
		{/if}
	</Button>
	<div class="absolute -bottom-2 left-0">
		<ColorPicker
			label=""
			components={{ textInput: TextInput }}
			swatches={colors.slice(0, -2).map((c) => c.hex())}
			bind:hex={color}
			bind:isOpen
			--input-size="0"
			--cp-bg-color="#333"
			--cp-border-color="var(--input)"
			--cp-text-color="var(--foreground)"
			--cp-input-color="#555"
			--cp-button-hover-color="#777"
			--focus-color="transparent"
		/>
	</div>
</div>
