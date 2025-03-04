<script lang="ts">
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<div class={'flex h-full w-full items-center justify-center'}>
	<SpinnerIcon class={cn(className, 'animate-spin text-foreground')} />
</div>
