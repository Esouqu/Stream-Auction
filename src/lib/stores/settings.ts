import { writable } from 'svelte/store';
import createStoreWithLocalStorage from './localStorage';

interface ISetting {
  isToggled: boolean | null;
  description: string;
  value: string | null;
  valueAttribute: string;
}

export const textRules = writable('Мои правила аукциона');
export const stopWheelOnDonation = writable({
  isToggled: false,
  description: 'Останавливать колесо при донате',
  value: '3000',
  valueAttribute: 'руб.',
});
export const addWheelSpinTimeOnDonation = writable({
  isToggled: true,
  description: 'Добавлять время к прокруту колеса за новый донат',
  value: '60',
  valueAttribute: 'сек.',
});
export const addWheelSpinTimeMinDonationPrice = writable({
  isToggled: true,
  description: 'Минимальная сумма доната для доп. времени прокрута колеса',
  value: '30',
  valueAttribute: 'руб.',
});
export const addWheelSpinTimeMinDonationPriceStep = writable({
  isToggled: true,
  description: 'Увеличивать минимальную сумму доната для доп. времени прокрута колеса после каждого добавления',
  value: '10',
  valueAttribute: 'руб.',
});
export const addTimeOnNewItem = writable({
  isToggled: true,
  description: 'Добавлять время за новый лот',
  value: '60',
  valueAttribute: 'сек.',
});
export const addTimeOnNewLeader = writable({
  isToggled: true,
  description: 'Добавлять время за нового лидера',
  value: '120',
  valueAttribute: 'сек.',
});
export const timerStarterTime = writable({
  isToggled: null,
  description: 'Стартовое время таймера',
  value: '10',
  valueAttribute: 'мин.',
});
// export const textRules = createStoreWithLocalStorage('', 'textRules');
// export const stopWheelOnDonation = createStoreWithLocalStorage({
//   isToggled: false,
//   description: 'Останавливать колесо при донате',
//   value: '30',
//   valueAttribute: 'руб.',
// }, 'stopWheelOnDonation');
// export const addWheelSpinTimeOnDonation = createStoreWithLocalStorage({
//   isToggled: true,
//   description: 'Добавлять время прокрутки колеса при донате',
//   value: '100',
//   valueAttribute: 'сек.',
// }, 'addWheelSpinTimeOnDonation');
// export const addTimeOnNewItem = createStoreWithLocalStorage({
//   isToggled: false,
//   description: 'Добавлять время за новый лот',
//   value: '60',
//   valueAttribute: 'сек.',
// }, 'addTimeOnNewItem');
// export const addTimeOnNewLeader = createStoreWithLocalStorage({
//   isToggled: false,
//   description: 'Добавлять время за нового лидера',
//   value: '120',
//   valueAttribute: 'сек.',
// }, 'addTimeOnNewLeader');
// export const timerStarterTime = createStoreWithLocalStorage({
//   isToggled: null,
//   description: 'Стартовое время таймера',
//   value: '10',
//   valueAttribute: 'мин.',
// }, 'timerStarterTime');
