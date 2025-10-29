<script module>
	// in some cases with absolute positioning,
	// backdrop-blur doesn't work correctly,
	// so we need to use a separate class
	export const BLUR_PANEL_STYLES =
		'rounded-full border border-input/30 bg-card/50 p-1.5 shadow-md backdrop-blur-md';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		children?: Snippet;
	};

	const { class: className, children }: Props = $props();
</script>

<div class={[BLUR_PANEL_STYLES, className]}>
	{@render children?.()}
</div>
