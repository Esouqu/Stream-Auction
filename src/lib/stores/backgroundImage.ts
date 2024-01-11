import storable from "./storable";

function createBackgroundImage() {
  const { subscribe, set } = storable('', 'backgroundImage');

  function clear() {
    set('');
  }

  return {
    subscribe,
    set,
    clear
  }
}

const backgroundImage = createBackgroundImage();

export default backgroundImage;
