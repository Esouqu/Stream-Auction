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
  const wheelWinnerDelay = storable({
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
    step: 10,
  }, 'extendSpinAction');
  const addByIdAction = storable(true, 'addByIdAction');
  const addLotWhileSpinAction = storable(true, 'addLotWhileSpinAction');
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
  const minSpinDuration = storable(10, 'minSpinDuration');
  const maxSpinDuration = storable(100, 'maxSpinDuration');
  const autoScroll = storable({
    isAuctionListEnabled: true,
    isWheelListEnabled: true,
    speed: 1,
  }, 'autoScroll');

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
    addLotWhileSpinAction,
    timerBaseTime,
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