import { get, writable } from 'svelte/store';
import storable from './storable';

interface IBackground {
  url: string;
  type: 'Картинка' | 'Видео';
}

function createSettings() {
  const background = storable<IBackground>({
    url: '',
    type: 'Картинка'
  }, 'background');
  const transparency = storable(0.7, 'transparency');
  const intensity = storable({
    isEnabled: true,
    price: 1000,
  }, 'intensity');
  const wheelWinnerDelay = storable({
    isEnabled: true,
    seconds: 3,
  }, 'wheelWinnerDelay');
  const stopSpinAction = storable({
    isEnabled: true,
    price: 5000,
  }, 'stopSpinAction');
  const extendSpinAction = storable({
    isEnabled: true,
    seconds: 60,
    price: 30,
    step: 10,
  }, 'extendSpinAction');
  const itemAddedAction = storable({
    isEnabled: true,
    seconds: 60,
  }, 'itemAddedAction');
  const leaderChangedAction = storable({
    isEnabled: true,
    seconds: 120,
  }, 'leaderChangedAction');
  const timerBaseTime = storable(10, 'timerBaseTime');
  const currentExtendSpinPrice = writable(get(extendSpinAction).price);

  function increaseExtendSpinPrice() {
    currentExtendSpinPrice.update((state) => state + get(extendSpinAction).step);
  }

  function resetBackground() {
    background.update((options) => ({ ...options, url: '' }));
  }

  function setBackgroundType(type: IBackground["type"]) {
    background.set({ url: '', type });
  }

  return {
    background,
    transparency,
    intensity,
    wheelWinnerDelay,
    stopSpinAction,
    extendSpinAction,
    itemAddedAction,
    leaderChangedAction,
    timerBaseTime,
    currentExtendSpinPrice,
    increaseExtendSpinPrice,
    resetBackground,
    setBackgroundType,
  }
}

const settings = createSettings();

export default settings;