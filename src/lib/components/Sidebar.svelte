<script lang="ts">
	import Settings from './settings/Settings.svelte';
	import Logo from './Logo.svelte';
	import { Button } from './ui/button';
	import { page } from '$app/state';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
	import Links from './Links.svelte';
	import ListIcon from './icons/ListIcon.svelte';
	import ListFillIcon from './icons/ListFillIcon.svelte';
	import PieIcon from './icons/PieIcon.svelte';
	import PieFillIcon from './icons/PieFillIcon.svelte';
	import { fade } from 'svelte/transition';
	import DevToolkit from './dev/DevToolkit.svelte';
	import { dev } from '$app/environment';

	const items = [
		{
			title: 'Аукцион',
			url: '/',
			icon: ListIcon,
			filledIcon: ListFillIcon
		},
		{
			title: 'Колесо',
			url: '/wheel',
			icon: PieIcon,
			filledIcon: PieFillIcon
		}
	];

	const currentRouteId = $derived(page.route.id);
</script>

<div class="flex w-[86px] shrink-0 flex-col items-center justify-between gap-4 pt-4 pb-8">
	<Logo />

	<div class="flex h-full flex-col justify-between py-5">
		<div class="flex flex-col gap-3">
			{#each items as item (item.title)}
				<Tooltip delayDuration={500}>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								href={item.url}
								variant="icon"
								size="sidebar"
								class="grid data-[active=true]:text-foreground"
								data-active={item.url === currentRouteId}
								draggable="false"
							>
								{#if item.url === currentRouteId}
									<div class="col-1 row-1" transition:fade={{ duration: 200 }}>
										<item.filledIcon />
									</div>
								{:else}
									<div class="col-1 row-1" transition:fade={{ duration: 200 }}>
										<item.icon />
									</div>
								{/if}
							</Button>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={0}>{item.title}</TooltipContent>
				</Tooltip>
			{/each}
		</div>
		<Links />
	</div>
	{#if dev}
		<DevToolkit />
	{/if}
	<Settings />
</div>
