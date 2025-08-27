<script lang="ts">
	import { Button } from './ui/button';
	import GithubIcon from './icons/GithubIcon.svelte';
	import TelegramIcon from './icons/TelegramIcon.svelte';
	import HandHeartIcon from '@lucide/svelte/icons/hand-heart';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

	const contacts = [
		{ href: 'https://www.donationalerts.com/r/esouqu', title: 'Поддержать', Icon: HandHeartIcon },
		{ href: 'https://t.me/esouqu', title: 'Написать', Icon: TelegramIcon },
		{ href: 'https://github.com/Esouqu/Stream-Auction', title: 'Посмотреть', Icon: GithubIcon }
	];
</script>

<div class="flex flex-col gap-3">
	{#each contacts as { title, href, Icon }}
		<Tooltip delayDuration={500}>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button {...props} {href} target="_blank" variant="icon" size="sidebar">
						<Icon class="size-6" />
					</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={0}>{title}</TooltipContent>
		</Tooltip>
	{/each}
</div>
