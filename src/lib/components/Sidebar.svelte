<script lang="ts">
	import ListIcon from 'lucide-svelte/icons/list';
	import ChartPieIcon from 'lucide-svelte/icons/chart-pie';
	import Settings from './settings/Settings.svelte';
	import { Separator } from './ui/separator';
	import Logo from './Logo.svelte';
	import { Button } from './ui/button';
	import { page } from '$app/stores';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
	import Contacts from './Contacts.svelte';

	const items = [
		{
			title: 'Аукцион',
			url: '/',
			icon: ListIcon
		},
		{
			title: 'Колесо',
			url: '/wheel',
			icon: ChartPieIcon
		}
	];
	const itemSize = 2.5;

	const currentRouteId = $derived($page.route.id);
	const currentRouteIdx = $derived(items.findIndex((item) => item.url === currentRouteId));
</script>

<div class="flex flex-col justify-between gap-4 border-r bg-card">
	<div class="p-2">
		<Logo />
	</div>
	<div class="relative flex h-full flex-col items-center">
		{#each items as item (item.title)}
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							href={item.url}
							class="z-10 opacity-60 hover:bg-transparent hover:opacity-100 data-[active=true]:bg-transparent data-[active=true]:text-primary-foreground data-[active=true]:opacity-100"
							variant="ghost"
							size="icon"
							data-active={item.url === currentRouteId}
							draggable="false"
						>
							<item.icon />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent side="right" sideOffset={12}>{item.title}</TooltipContent>
			</Tooltip>
		{/each}
		<span
			class="pointer-events-none absolute left-0 top-0 z-0 h-10 w-full rounded-r bg-primary transition-all duration-300"
			style="translate: 0 {currentRouteIdx * itemSize}rem;"
		></span>
	</div>
	<div class="flex flex-col p-2">
		<!-- {#if dev}
			<DevKit />
			<Todo />
			<Separator class="my-2" />
		{/if} -->
		<Contacts />
		<Separator class="my-2" />
		<Settings />
	</div>
</div>
