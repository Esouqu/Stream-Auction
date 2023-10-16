import { browser } from "$app/environment";
import { writable } from "svelte/store";

function createStoreWithLocalStorage<T>(initialValue: T, key: string) {
  if (browser) initialValue = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue));
  const { subscribe, set: _set } = writable<T>(initialValue);

  return {
    subscribe,
    set(newValue: T) {
      localStorage.setItem(key, JSON.stringify(newValue));
      _set(newValue);
    }
  }
}

export default createStoreWithLocalStorage;