import { writable } from 'svelte/store';
import createStoreWithLocalStorage from './localStorage';
import type { ITimerSettings } from '$lib/interfaces';
import { TIMER_SETTINGS } from '$lib/enums';

// function createTimerSettings() {
//   const { subscribe, set, update } = writable<ITimerSettings[]>([
//     {
//       id: TIMER_SETTINGS.ADD_TIME_NEW_LOT,
//       description: 'Добавлять время за новый лот',
//       isToggled: true,
//       options: [
//         {title: 'Время', value: 60, attribute: 'сек.'}
//       ]
//     },
//     {
//       id: TIMER_SETTINGS.ADD_TIME_NEW_LEADER,
//       description: 'Добавлять время за нового лидера',
//       isToggled: true,
//       options: [
//         {title: 'Время', value: 120, attribute: 'сек.'}
//       ]
//     },
//     {
//       id: TIMER_SETTINGS.START_TIMER_TIME,
//       description: 'Стартовое время таймера',
//       isToggled: null,
//       options: [
//         {title: 'Время', value: 10, attribute: 'мин.'}
//       ]
//     }
//   ]);

//   function toggle(id: TIMER_SETTINGS, isToggled: boolean) {
//     update(settings => {
//       return settings.map(item => {
//         if (item.id === id) return { ...item, isToggled };

//         return item;
//       });
//     });
//   };

//   function updateOptionValue(id: TIMER_SETTINGS, option:, value) {
//     update(settings => {
//       return settings.map(item => {
//         if (item.id !== id) return item;

//         const options = item.options.map((option, index) => {
//           if (index === optionIndex) {
//             return { ...option, value };
//           }
//           return option;
//         });
//         return { ...item, options };
//       });
//     });
//   };

//   return {
//     subscribe,
//   }
// }

// const timerSettings = createTimerSettings();

// export default timerSettings;

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
