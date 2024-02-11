import type { IPreset } from '$lib/interfaces';
import storable from './storable';

const initialPresets: IPreset[] = [
  { title: 'Правила', text: '' }
  // {
  //   title: 'Арчи',
  //   text: 'КИНО ИГРЫ АНИМЕ СЕРИАЛЫ = 2 ЧАСА\nЮТУБ ТВИЧ ТИКТОК = 1 ЧАС\nОСОБОЕ ЗАДАНИЕ БЕЗ ГОВНЯКА\nmin ban 1000 roubles',
  // },
  // {
  //   title: 'Флешка',
  //   text: 'Колесный аук, просмотровый, только фильмы, мульты (без аниме и пони),\nЧто угодно, только без сисек, писек, попиков (для просмотра на твиче)\nФильм должен быть на кинопоиске\n(просто в базе, не обязательно, чтобы можно было смотреть)\nСкипаю любой кал, который не понравится (донат под своим ником плз)',
  // },
  // {
  //   title: 'Бьерн',
  //   text: '- Играем 2 часа, если игра - Meh - Играем Вечно, если игра - Класс - Запрещены спорт/космо симы - +1 минута, при смене лидера - Аукцион КЛАССИЧЕСКИЙ - Давайте постараемся, чтобы игра была в Русском Steam',
  // },
]

function createPresets() {
  const { subscribe, set, update } = storable<IPreset[]>(initialPresets, 'presets');

  function remove(index: number) {
    update((items) => items.filter((_, idx) => idx !== index));
  }

  function create() {
    update((items) => [...items, { title: '', text: '' }]);
  }

  return {
    subscribe,
    set,
    remove,
    create,
  }
}

const presets = createPresets();

export default presets;