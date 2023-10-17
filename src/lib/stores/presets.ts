import { browser } from '$app/environment';
import { writable } from 'svelte/store';

interface ISetting {
  isToggled: boolean | null;
  description: string;
  value: string | null;
  valueAttribute: string;
}

interface IPreset {
  textRules: string,
  stopWheelOnDonation: ISetting,
  addTimeOnNewItem: ISetting,
  addTimeOnNewLeader: ISetting,
  timerStarterTime: ISetting,
}

const initialSettings = new Map();

initialSettings.set('default', {
  textRules: '',
  stopWheelOnDonation: {
    isToggled: false,
    description: 'Останавливать колесо при донате',
    value: '',
    valueAttribute: 'руб.',
  },
  addTimeOnNewItem: {
    isToggled: false,
    description: 'Добавлять время за новый лот',
    value: '',
    valueAttribute: 'сек.',
  },
  addTimeOnNewLeader: {
    isToggled: false,
    description: 'Добавлять время за нового лидера',
    value: '',
    valueAttribute: 'сек.',
  },
  timerStarterTime: {
    isToggled: null,
    description: 'Стартовое время таймера',
    value: '',
    valueAttribute: 'мин.',
  }
})

function createPresets(initialValue: Map<string, IPreset>, key: string) {
  let storedValue: typeof initialValue = initialValue;

  if (browser) {
    const storedData = localStorage.getItem(key);

    if (!storedData) {
      storedValue = initialValue;
    } else {
      storedValue = new Map(JSON.parse(storedData));
    }
  }

  const { subscribe, set: _set, update } = writable<typeof initialValue>(storedValue);

  function create(name: string) {
    const storedPreset = localStorage.getItem(name);

    if (storedPreset) {

    }

    // localStorage.setItem(key, JSON.stringify(newValue));
    // update((state) => [...state, { name: initialSettings }]);
  }

  return {
    subscribe,
    set(newValue: Map<string, IPreset>) {
      localStorage.setItem(key, JSON.stringify(newValue));
      _set(newValue);
    }
  }
}

const presets = createPresets(initialSettings, 'presets');

export default presets;