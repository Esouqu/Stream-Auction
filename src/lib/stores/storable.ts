import { browser } from "$app/environment";
import { writable, type Updater, get } from "svelte/store";

function storable<T>(initialValue: T, key: string) {
  if (browser) initialValue = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue));

  const store = writable<T>(initialValue);
  const { subscribe, set: _set, update: _update } = store;

  return {
    subscribe,
    set(newValue: T) {
      localStorage.setItem(key, JSON.stringify(newValue));
      _set(newValue);
    },
    update(updater: Updater<T>) {
      const updatedState = updater(get(store));
      localStorage.setItem(key, JSON.stringify(updatedState));
      _set(updatedState);
    }
  }
}

export default storable;