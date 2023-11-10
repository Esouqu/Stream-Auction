import { writable } from "svelte/store";

function createBackgroundImage() {
  const { subscribe, set } = writable('');

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
