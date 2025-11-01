<script lang="ts">
	import HammerIcon from '@lucide/svelte/icons/hammer';
	import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { randomFromRange } from '$lib/utils';
	import { Button, buttonVariants } from '../ui/button';

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

	function addDonation() {
		app.donations.add({
			id: crypto.randomUUID(),
			username: 'dev',
			amount: 100,
			currency: 'RUB',
			message: 'Тестовое сообщение в пять слов',
			source: 'DonationAlerts',
			isInstant: Math.random() < 0.5
		});
	}

	function addLots() {
		for (const entry of entries) {
			app.lots.add(entry, randomFromRange(100, 9999));
		}
	}
</script>

<Popover>
	<PopoverTrigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
		<HammerIcon />
	</PopoverTrigger>
	<PopoverContent side="right">
		<Button onclick={addLots}>Добавить лоты</Button>
		<Button onclick={addDonation}>Добавить донат</Button>
	</PopoverContent>
</Popover>
