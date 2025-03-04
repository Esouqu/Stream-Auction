<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Icon as IconType } from 'lucide-svelte';

	interface Props {
		Icon: typeof IconType;
		pressed?: boolean;
		class?: string;
		onclick: () => void;
	}

	const { Icon, pressed, onclick }: Props = $props();
</script>

<Button
	variant="ghost"
	size="icon"
	class="hover:bg-white/10 data-[pressed=false]:text-muted-foreground data-[pressed=true]:text-primary"
	data-pressed={pressed}
	{onclick}
>
	<Icon />
</Button>
