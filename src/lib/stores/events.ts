import type { eventTypes } from '$lib/interfaces';
import { writable } from 'svelte/store';

interface IEvent {
  id: number;
  message: string;
  type: eventTypes;
  donationType: 'Twitch' | 'Donation Alerts';
}

function createEvents() {
  const { subscribe, set, update } = writable<IEvent[]>([]);

  let id = 0;

  function add(message: string, donationType: 'Twitch' | 'Donation Alerts', type: eventTypes = null,) {
    id += 1;

    update((messages) => [...messages, { id, message, type, donationType }]);
  }

  function remove(id: number) {
    update((messages) => messages.filter((m) => m.id !== id))
  }

  function clear() {
    id = 0;

    set([]);
  }

  return {
    subscribe,
    add,
    remove,
    clear
  }
}

const events = createEvents();

export default events;