<script lang="ts">
	interface Props {
		color?: string;
		strokeColor: string;
	}

	const { color, strokeColor }: Props = $props();
</script>

<div
	class="pointer-events-none absolute top-1/2 left-1/2 z-10 h-full w-full -translate-1/2 rounded-full border-[0.25rem] shadow-[inset_0_0_0_4px_hsl(var(--muted)),_inset_0_0_12px_black] outline-8 duration-300"
	style="border-color: {strokeColor}; outline-color: {color};"
></div>
