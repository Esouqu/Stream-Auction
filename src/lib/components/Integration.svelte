<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from './ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

	interface Props {
		title: string;
		username?: string;
		icon: Snippet;
		onAuth?: () => void;
		onLogout?: () => void;
	}

	const { title, username, icon, onAuth, onLogout }: Props = $props();
</script>

<div class="flex w-full items-center">
	{#if !username}
		<Button variant="outline" size="lg" class="w-full" onclick={onAuth}>
			{@render icon()}
			Авторизоваться
		</Button>
	{:else}
		<Card class="flex w-full flex-row justify-between">
			<CardHeader class="grow gap-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription class="text-sm">{username}</CardDescription>
			</CardHeader>
			<CardContent class="flex items-center">
				<Button variant="ghost" onclick={onLogout}>Выйти</Button>
			</CardContent>
		</Card>
	{/if}
</div>
