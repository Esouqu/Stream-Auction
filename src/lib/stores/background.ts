import storable from "./storable";

interface IBackground {
  url: string;
  type: 'Картинка' | 'Видео';
}

function createBackground() {
  const { subscribe, set, update } = storable<IBackground>({
    url: '',
    type: 'Картинка'
  }, 'background');
  const transparency = storable(0.7, 'transparency');

  function reset() {
    update((options) => ({ ...options, url: '' }));
  }

  function setType(type: IBackground["type"]) {
    set({ url: '', type });
  }

  return {
    subscribe,
    set,
    transparency,
    reset,
    setType
  }
}

const background = createBackground();

export default background;
