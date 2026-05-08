<script lang="ts">
	import SpinnerIcon from '@lucide/svelte/icons/loader-circle';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<SpinnerIcon class={cn('animate-spin text-foreground', className)} />
