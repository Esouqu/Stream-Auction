import type { Writable } from "svelte/store"

// signal will only call its subscribers for changes that happen
// after the call to subscribe
function signal<T>(store: Writable<T>) {
  return {
    ...store,
    subscribe(subscriber: (value: T) => void) {
      let initial = true

      const unsubscribe = store.subscribe($state => {
        if (!initial) {
          subscriber($state)
        }
      });

      initial = false;

      return unsubscribe;
    }
  }
};

export default signal;

