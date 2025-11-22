<script lang="ts">
	import HammerIcon from '@lucide/svelte/icons/hammer';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { randomFromRange } from '$lib/utils';
	import { Button, buttonVariants } from '../ui/button';
	import { Card, CardContent, CardTitle } from '../ui/card';
	import { Input } from '../ui/input';

	const app = getAppManagerContext();

	const entries = [
		'Побег из Шоушенка',
		'Криминальное чтиво',
		'Форрест Гамп',
		'Начало',
		'Список Шиндлера',
		'Леон',
		'Интерстеллар',
		'Бойцовский клуб',
		'Крестный отец',
		'Тёмный рыцарь',
		'Паразиты',
		'Назад в будущее',
		'Пролетая над гнездом кукушки',
		'Матрица',
		'Зеленая миля',
		'Король Лев',
		'Титаник',
		'Терминатор 2: Судный день',
		'Один дома',
		'Амели'
	];

	let donationMessage = $state('');

	function addDonation() {
		app.donations.add({
			id: crypto.randomUUID(),
			username: 'dev',
			amount: 100,
			currency: 'RUB',
			message: donationMessage || 'Тестовое сообщение в пять слов',
			source: 'DonationAlerts',
			isInstant: false
		});
	}

	function addLots() {
		for (const entry of entries) {
			const randomValue = randomFromRange(100, 9999);
			app.lots.add(entry, randomValue);
		}
	}
</script>

<Popover>
	<PopoverTrigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
		<HammerIcon class="text-muted-foreground" />
	</PopoverTrigger>
	<PopoverContent class="w-fit bg-elevation-1" side="right" align="end" sideOffset={32}>
		<Card class="bg-transparent">
			<CardTitle class="px-2">Лоты</CardTitle>
			<CardContent class="flex gap-2 px-2">
				<Button onclick={addLots}>Добавить ({entries.length})</Button>
			</CardContent>
		</Card>
		<Card class="bg-transparent">
			<CardTitle class="px-2">Донат</CardTitle>
			<CardContent class="flex gap-2 px-2">
				<Input
					id="donation-message"
					type="string"
					class="w-[200px] shrink-0"
					placeholder="Сообщение"
					bind:value={donationMessage}
				/>
				<Button onclick={addDonation}>Добавить</Button>
			</CardContent>
		</Card>
	</PopoverContent>
</Popover>
