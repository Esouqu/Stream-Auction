<script lang="ts">
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import SettingsIcon from 'lucide-svelte/icons/settings';
	import DialogHeader from '$lib/components/ui/dialog/dialog-header.svelte';
	import { buttonVariants } from '../ui/button';
	import { Separator } from '../ui/separator';
	import WheelSettings from './components/WheelSettings.svelte';
	import DonationSettings from './components/DonationSettings.svelte';
	import InterfaceSettings from './components/InterfaceSettings.svelte';
	import TimerSettings from './components/TimerSettings.svelte';

	const tabs = [
		{ title: 'Интерфейс', value: 'interface', component: InterfaceSettings },
		{ title: 'Таймер', value: 'timer', component: TimerSettings },
		{ title: 'Колесо', value: 'wheel', component: WheelSettings },
		{ title: 'Донат', value: 'donation', component: DonationSettings }
	];
	const itemSize = 2;

	let currentTabId = $state(0);

	function onValueChange(v: string) {
		currentTabId = tabs.findIndex(({ value }) => value === v);
	}
</script>

<Dialog onOpenChange={() => (currentTabId = 0)}>
	<DialogTrigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
		<SettingsIcon />
	</DialogTrigger>
	<DialogContent
		class="flex aspect-[3/2] h-[35rem] w-auto max-w-none flex-col gap-0 border-border/50 p-0"
	>
		<DialogHeader class="p-4">
			<DialogTitle>Настройки</DialogTitle>
		</DialogHeader>

		<Separator orientation="horizontal" class="bg-border/50" />

		<Tabs class="flex h-full overflow-hidden" {onValueChange}>
			<TabsList class="flex h-auto w-1/3 flex-col justify-start bg-transparent p-4">
				<div class="relative flex h-full w-full flex-col items-center">
					{#each tabs as { title, value }, idx (title)}
						<TabsTrigger
							class="w-full select-none justify-start gap-4 transition-colors duration-200 hover:text-white data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
							{value}
							onclick={() => (currentTabId = idx)}
						>
							{title}
						</TabsTrigger>
					{/each}
					<span
						class="pointer-events-none absolute left-0 top-0 z-[-1] w-full rounded bg-primary transition-all duration-300"
						style="height: {itemSize}rem; translate: 0 {currentTabId * itemSize}rem;"
					></span>
				</div>
			</TabsList>

			<Separator orientation="vertical" class="bg-border/50" />

			<ScrollArea class="h-full w-full gap-0 px-6">
				<div class="grid">
					{#each tabs as tab, idx}
						{#if currentTabId === idx}
							<div class="col-start-1 row-start-1">
								<TabsContent value={tab.value}>
									<tab.component />
								</TabsContent>
							</div>
						{/if}
					{/each}
				</div>
			</ScrollArea>
		</Tabs>
	</DialogContent>
</Dialog>
