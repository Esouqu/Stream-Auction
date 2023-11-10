import type { ISetting, } from '$lib/interfaces';
import { writable } from 'svelte/store';

export const textRules = writable('');
export const stopSpin = writable({
  isToggled: true,
  description: 'Останавливать колесо при донате',
  value: 5000,
  valueAttribute: 'руб.',
});

// const settings = writable<ISetting[]>([
//   {
//     isToggled: false,
//     description: 'Останавливать колесо при донате',
//     options: [
//       { id: 1, title: 'Минимальная сумма доната', value: 3000, attribute: 'руб.' }
//     ]
//   },
//   {
//     isToggled: false,
//     description: 'Добавлять время к прокруту колеса за донат',
//     options: [
//       { id: 1, title: 'Добавочное время', value: 60, attribute: 'сек.' },
//       { id: 2, title: 'Минимальная сумма доната', value: 30, attribute: 'руб.' },
//       { id: 3, title: 'Сумма увеличения минимального доната за каждое продление', value: 10, attribute: 'руб.' },
//     ]
//   },
//   {
//     isToggled: true,
//     description: 'Доп. время за новый лот',
//     options: [
//       { id: 1, title: 'Время', value: 60, attribute: 'сек.' }
//     ]
//   },
//   {
//     isToggled: true,
//     description: 'Доп. ремя за нового Лидера',
//     options: [
//       { id: 1, title: 'Время', value: 120, attribute: 'сек.' }
//     ]
//   },
//   {
//     isToggled: true,
//     description: 'Стартовое время таймера',
//     options: [
//       { id: 1, title: 'Время', value: 10, attribute: 'мин.' }
//     ]
//   },
// ]

// );

// export default settings;

export const additionSpinTime = writable({
  isToggled: true,
  description: 'Добавлять время к прокруту колеса за донат',
  value: 60,
  valueAttribute: 'сек.',
});
export const additionSpinTimePrice = writable({
  isToggled: null,
  description: 'Минимальная сумма добавления',
  value: 30,
  valueAttribute: 'руб.',
});
export const additionSpinTimePriceStep = writable({
  isToggled: null,
  description: 'Увеличениe минимальной суммы за каждое добавление',
  value: 10,
  valueAttribute: 'руб.',
});

export const addTimeOnNewItem = writable({
  isToggled: true,
  description: 'Добавлять время за новый лот',
  value: 60,
  valueAttribute: 'сек.',
});
export const addTimeOnNewLeader = writable({
  isToggled: true,
  description: 'Добавлять время за нового лидера',
  value: 120,
  valueAttribute: 'сек.',
});
export const timerStarterTime = writable({
  isToggled: null,
  description: 'Стартовое время таймера',
  value: 10,
  valueAttribute: 'мин.',
});
