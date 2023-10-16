import createStoreWithLocalStorage from './localStorage';

interface ISetting {
  isToggled: boolean;
  description: string;
  value: string | null;
}

export const textRules = createStoreWithLocalStorage('', 'textRules');
export const stopWheelOnDonation = createStoreWithLocalStorage({
  isToggled: false,
  description: 'Останавливать колесо при донате',
  value: '',
  valueAttribute: 'руб.',
}, 'stopWheelOnDonation');
export const addTimeOnNewItem = createStoreWithLocalStorage({
  isToggled: false,
  description: 'Добавлять время за новый лот',
  value: '',
  valueAttribute: 'сек.',
}, 'addTimeOnNewItem');
export const addTimeOnNewLeader = createStoreWithLocalStorage({
  isToggled: false,
  description: 'Добавлять время за нового лидера',
  value: '',
  valueAttribute: 'сек.',
}, 'addTimeOnNewLeader');
export const timerStarterTime = createStoreWithLocalStorage({
  isToggled: false,
  description: 'Стартовое время таймера',
  value: '',
  valueAttribute: 'мин.',
}, 'timerStarterTime');

