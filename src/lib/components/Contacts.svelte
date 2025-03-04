<script lang="ts">
	import { Button } from './ui/button';
	import GithubIcon from './icons/GithubIcon.svelte';
	import TelegramIcon from './icons/TelegramIcon.svelte';
	import HandHeartIcon from 'lucide-svelte/icons/hand-heart';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();

	const contacts = [
		{ href: 'https://www.donationalerts.com/r/esouqu', title: 'Поддержать', Icon: HandHeartIcon },
		{ href: 'https://t.me/esouqu', title: 'Написать', Icon: TelegramIcon },
		{ href: 'https://github.com/Esouqu/Stream-Auction', title: 'Посмотреть', Icon: GithubIcon }
	];
</script>

<div class="flex flex-col {className}">
	{#each contacts as { title, href, Icon }}
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="link"
						size="icon"
						{href}
						target="_blank"
						class="text-accent hover:text-primary"
					>
						<Icon size="1.5rem" />
					</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={12}>{title}</TooltipContent>
		</Tooltip>
	{/each}
</div>
