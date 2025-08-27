<script lang="ts">
	import storable from '$lib/stores/LocalStore.svelte';
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from './ui/dialog';
	import { formatDate } from '$lib/utils';
	import XIcon from '@lucide/svelte/icons/x';

	const lastSeenUpdates = storable<number | null>(null, 'lastSeenUpdates');
	const lastUpdateDate = new Date('2025-08-26 11:00:00');

	let haveSeenUpdates = $derived(
		lastSeenUpdates.value ? new Date(lastSeenUpdates.value) > lastUpdateDate : false
	);

	function onOpenChange(isOpen: boolean) {
		if (!isOpen) {
			lastSeenUpdates.value = new Date().getTime();
		}
	}
</script>

<Dialog open={haveSeenUpdates} {onOpenChange}>
	<DialogTrigger class="absolute" />
	<DialogContent class="w-[600px] gap-0">
		<DialogHeader>
			<DialogTitle>Обновление</DialogTitle>
			<DialogDescription>
				{formatDate(new Date(lastUpdateDate))}
			</DialogDescription>
		</DialogHeader>

		<DialogClose
			class="absolute top-4 right-4 cursor-pointer text-muted-foreground transition-colors outline-none hover:text-foreground"
		>
			<XIcon />
		</DialogClose>

		<div class="space-y-4 p-6 pt-0">
			<div>
				<div class="text-lg leading-10 font-semibold">Страница аукциона</div>
				<ul class="space-y-2">
					<li>Добавлена кнопка для смены отображения названия лота на никнеймы донатеров</li>
					<li>Добавлена возможность скрыть анимацию добавления нового лота по наведению на него</li>
				</ul>
			</div>
			<div>
				<div class="text-lg leading-10 font-semibold">Страница колеса</div>
				<ul class="space-y-2">
					<li>Добавлена кнопка для генерации новых случайных цветов</li>
					<li>
						Добавлен таймаут в 10 секунд после завершения кручения, в течение которого донаты не
						добавляются к лотам автоматически
					</li>
				</ul>
			</div>
			<div>
				<div class="text-lg leading-10 font-semibold">Таймер</div>
				<ul class="space-y-2">
					<li>Формат таймера теперь — мин:сек:мс</li>
					<li>Максимальное время таймера теперь 60 минут</li>
					<li>Добавлен счетчик нажатий на кнопку прибавления и отнимания времени</li>
				</ul>
			</div>
			<div>
				<div class="text-lg leading-10 font-semibold">Остальное</div>
				<ul class="space-y-2">
					<li>Обновлен дизайн</li>
					<li>Добавлена возможность менять размытие фона</li>
					<li>Убран выбор основного цвета</li>
				</ul>
			</div>
		</div>
	</DialogContent>
</Dialog>
