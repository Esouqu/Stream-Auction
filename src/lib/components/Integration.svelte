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
		<Card class="flex w-full justify-between">
			<CardHeader class="p-4">
				<CardTitle>{title}</CardTitle>
				<CardDescription class="text-xs">Пользователь: {username}</CardDescription>
			</CardHeader>
			<CardContent class="p-4">
				<Button variant="ghost" onclick={onLogout}>Выйти</Button>
			</CardContent>
		</Card>
	{/if}
</div>
