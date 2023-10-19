import { writable } from 'svelte/store';

function createEvents() {
  const { subscribe, set, update } = writable<string[]>([]);

  function add(message: string) {
    update((messages) => [...messages, message]);
  }

  function clear() {
    set([]);
  }

  return {
    subscribe,
    add,
    clear
  }
}

const events = createEvents();

export default events;