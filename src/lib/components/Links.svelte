<script lang="ts">
	import { Button } from './ui/button';
	import TelegramIcon from './icons/TelegramIcon.svelte';
	import Donut from '@lucide/svelte/icons/donut';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
	import GithubIcon from '@lucide/svelte/icons/github';

	const contacts = [
		{ href: 'https://dalink.to/esouqu', title: 'Поддержать', Icon: Donut },
		{ href: 'https://t.me/esouqu', title: 'Написать', Icon: TelegramIcon },
		{ href: 'https://github.com/Esouqu/Stream-Auction', title: 'Посмотреть', Icon: GithubIcon }
	];
</script>

<div class="flex flex-col gap-3">
	{#each contacts as { title, href, Icon }}
		<Tooltip delayDuration={500}>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button {...props} {href} target="_blank" variant="icon" size="sidebar" draggable="false">
						<Icon class="size-6" />
					</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={0}>{title}</TooltipContent>
		</Tooltip>
	{/each}
</div>
