<script lang="ts">
	interface Props {
		color?: string;
	}

	const { color }: Props = $props();
</script>

<div
	class="pointer-events-none absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_0_0_0_4px_hsl(var(--muted)),_inset_0_0_12px_black] outline outline-[0.5rem] outline-muted"
	style="border-color: {color};"
></div>
