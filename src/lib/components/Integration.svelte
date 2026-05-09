<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from './ui/button';

	interface Props {
		title: string;
		isLoggedIn: boolean;
		icon: Snippet;
		onAuth?: () => void;
		onLogout?: () => void;
	}

	const { title, isLoggedIn, icon, onAuth, onLogout }: Props = $props();
</script>

<div class="flex w-full items-center">
	<div class="flex w-full flex-col gap-2 rounded-xl bg-card p-4 text-card-foreground shadow-md">
		<div class="flex items-center justify-center gap-2 font-semibold">{@render icon()} {title}</div>
		{#if isLoggedIn}
			<Button size="sm" variant="ghost" onclick={onLogout}>Выйти</Button>
		{:else}
			<Button size="sm" class="w-full" onclick={onAuth}>Подключить</Button>
		{/if}
	</div>
</div>
