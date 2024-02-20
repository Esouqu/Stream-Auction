import type { IPreset } from '$lib/interfaces';
import storable from './storable';

const initialPresets: IPreset[] = [
  {
    title: 'Правила', text: `Переходя на другие страницы, кручение колеса продолжится. Таким образом вы можете добавлять/изменять/удалять лоты переходя на страницу с лотами или менять настройки на странице настроек не прерывая кручения колеса.\n\nНазвание пресета правил можно изменить кликнув выше по "Правила".\n\nДобавить пресет можно нажав на стрелочку слева от "Правила", после чего нажав на иконку плюса в самом низу.\n\nПресеты сохраняются до очищения кэша браузера. То же с настройками на странице настроек.\n\nВНИМАНИЕ: Лоты не сохраняются!`
  }
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