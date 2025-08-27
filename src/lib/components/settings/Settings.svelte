<script lang="ts">
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import DialogHeader from '$lib/components/ui/dialog/dialog-header.svelte';
	import { buttonVariants } from '../ui/button';
	import WheelSettings from './components/WheelSettings.svelte';
	import DonationSettings from './components/DonationSettings.svelte';
	import InterfaceSettings from './components/InterfaceSettings.svelte';
	import TimerSettings from './components/TimerSettings.svelte';

	const tabs = [
		{ title: 'Донат', value: 'donation', component: DonationSettings },
		{ title: 'Интерфейс', value: 'interface', component: InterfaceSettings },
		{ title: 'Колесо', value: 'wheel', component: WheelSettings },
		{ title: 'Таймер', value: 'timer', component: TimerSettings }
		// { title: 'Аудио', value: 'audio', component: TimerSettings }
	];

	let currentTabId = $state(0);

	let itemsSizes: (HTMLElement | null)[] = $state(new Array(tabs.length).fill(null));
	let prevWidthSum = $derived(
		itemsSizes.reduce(
			(acc, item, idx) => (currentTabId > idx ? acc + (item?.offsetWidth ?? 0) : acc),
			0
		)
	);
	let spanWidth = $derived(itemsSizes[currentTabId]?.offsetWidth ?? 65);

	function getValue() {
		return currentTabId.toString();
	}

	function setValue(v: string) {
		currentTabId = parseInt(v);
	}
</script>

<Dialog onOpenChange={() => (currentTabId = 0)}>
	<DialogTrigger class={buttonVariants({ variant: 'icon', size: 'sidebar' })}>
		<SettingsIcon />
	</DialogTrigger>
	<DialogContent class="flex h-[740px] w-[680px] flex-col gap-0 border-border/50">
		<DialogHeader>
			<DialogTitle>Настройки</DialogTitle>
		</DialogHeader>

		<Tabs class="h-full overflow-hidden bg-none" bind:value={getValue, setValue}>
			<TabsList class="relative mx-auto h-auto border bg-card p-2">
				<div class="relative flex h-full w-full items-center">
					{#each tabs as { title }, idx (title)}
						<TabsTrigger
							bind:ref={itemsSizes[idx]}
							class="relative z-20 w-full shrink gap-4 px-3 text-muted-foreground transition-colors duration-200 select-none hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
							value={idx.toString()}
						>
							{title}
						</TabsTrigger>
					{/each}
					<span
						class="pointer-events-none absolute top-0 left-0 z-10 h-8 translate-y-1/2 rounded-md bg-accent py-2 transition-all duration-300"
						style="width: {spanWidth}px; translate: {prevWidthSum}px 0;"
					></span>
				</div>
			</TabsList>

			<ScrollArea class="h-full w-full gap-0 overflow-hidden px-6">
				{#each tabs as tab, idx}
					{#if currentTabId === idx}
						<TabsContent class="py-4" value={idx.toString()}>
							<tab.component />
						</TabsContent>
					{/if}
				{/each}
			</ScrollArea>
		</Tabs>
	</DialogContent>
</Dialog>
