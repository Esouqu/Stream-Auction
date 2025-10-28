<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		children?: Snippet;
	};

	const { class: className, children }: Props = $props();
</script>

<div
	class={[
		'rounded-full border border-input/30 bg-card/50 p-1.5 shadow-md backdrop-blur-md',
		className
	]}
>
	{@render children?.()}
</div>
