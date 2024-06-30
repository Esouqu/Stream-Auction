import { get, writable } from 'svelte/store';
import storable from './storable';

interface IBackground {
  url: string;
  type: 'image' | 'video';
}

function createSettings() {
  const background = storable<IBackground>({
    url: '',
    type: 'image'
  }, 'background');
  const transparency = storable(0.7, 'transparency');
  const intensity = storable({
    isEnabled: false,
    price: 1000,
  }, 'intensity');
  const spinStopDelay = storable({
    isEnabled: false,
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
    stepType: 'fixed',
    step: 10,
  }, 'extendSpinAction');
  const addByIdAction = storable(true, 'addByIdAction');
  const itemAddedAction = storable({
    isEnabled: true,
    seconds: 60,
  }, 'itemAddedAction');
  const leaderChangedAction = storable({
    isEnabled: true,
    seconds: 120,
  }, 'leaderChangedAction');
  const timerBaseTime = storable(10, 'timerBaseTime');
  const timerKeyConfig = storable({
    isEnabled: true,
    add: 'ArrowUp',
    subtract: 'ArrowDown',
    reset: 'ArrowLeft',
    startOrPause: 'ArrowRight'
  }, 'timerKeyConfig');
  const currentExtendSpinPrice = writable(get(extendSpinAction).price);
  const minSpinDuration = storable(10, 'minSpinDuration');
  const maxSpinDuration = storable(100, 'maxSpinDuration');
  const autoScroll = storable({
    isAuctionListEnabled: true,
    isWheelListEnabled: true,
    speed: 1,
  }, 'autoScroll');


  function increaseExtendSpinPrice(amount?: number) {
    if (!amount) {
      currentExtendSpinPrice.update((state) => state + get(extendSpinAction).step);
    } else {
      currentExtendSpinPrice.set(amount)
    }
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
    spinStopDelay,
    stopSpinAction,
    extendSpinAction,
    itemAddedAction,
    leaderChangedAction,
    timerBaseTime,
    timerKeyConfig,
    currentExtendSpinPrice,
    minSpinDuration,
    maxSpinDuration,
    addByIdAction,
    autoScroll,
    increaseExtendSpinPrice,
    resetBackground,
    setBackgroundType,
  }
}

const settings = createSettings();

export default settings;