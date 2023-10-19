import colors from "$lib/colors";
import type { ILot } from "$lib/interfaces";
import { getRandomColor } from "$lib/utils";
import { writable } from "svelte/store";

const tempLots = [
  {
    id: 1,
    title: 'Гуррен Лаганн',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
  {
    id: 2,
    title: 'Холоп 2 (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
  {
    id: 3,
    title: 'Самая большая луна (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
  {
    id: 4,
    title: 'Гардемарины 1787. Мир (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
  {
    id: 5,
    title: 'Гладиатор',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
  {
    id: 6,
    title: 'Дворец (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color: getRandomColor(colors[4]),
  },
];

function createLots() {

  // need to shuffleArray

  const { subscribe, update } = writable<ILot[]>(tempLots);

  let id = tempLots.length;
  let color = getRandomColor(colors[4]);
  let previousLotsAmount = tempLots.length;
  let previousLeader = tempLots[0].id;
  // let id = 0;
  // let color = '';
  // let previousLotsAmount = 0;
  // let previousLeader = 0;

  function add(title: string, value: number, donator?: string) {
    id += 1;
    color = getRandomColor(colors[4]);

    update((lots) => {
      const randomIdx = Math.floor(Math.random() * lots.length);
      const newLot = { id, title, value, donators: donator ? [donator] : [], color };

      return [...lots.slice(0, randomIdx), newLot, ...lots.slice(randomIdx)];
    });
  }

  function remove(id: number) {
    update((items) => items.filter(item => item.id !== id));
  }

  function removeAll() {
    id = 0;
    update(() => []);
  }

  function setTitle(id: number, title: string) {
    update((items) => items.map((item) => {
      if (item.id !== id) return item;

      return { ...item, title };
    }));
  }

  function addValue(id: number, value: number, donator?: string) {
    update((lots) => lots.map((lot) => {
      if (lot.id !== id) return lot;

      if (donator && lot.donators.includes(donator)) {
        return { ...lot, value: lot.value + value, donators: [...lot.donators, donator] }
      }

      return { ...lot, value: lot.value + value };
    }));
  }

  function setValue(id: number, value: number) {
    update((lots) => lots.map((lot) => {
      if (lot.id !== id) return lot;

      return { ...lot, value };
    }));
  }

  function subtractValue(id: number, value: number) {
    update((items) => items.map(item => {
      if (item.id !== id) return item;

      return { ...item, value: item.value - value };
    }));
  }

  function onNewItem(callback: () => void) {
    update((state) => {
      if (state.length <= previousLotsAmount) return state;

      previousLotsAmount = state.length;
      callback();

      return state
    })
  }

  function onNewLeader(callback: () => void) {
    update((state) => {
      const newLeader = [...state].sort((a, b) => b.value - a.value)[0].id;

      if (previousLeader !== newLeader) {
        previousLeader = newLeader;
        callback();
      }

      return state
    })
  }

  return {
    subscribe,
    add,
    remove,
    removeAll,
    setTitle,
    addValue,
    setValue,
    subtractValue,
    onNewItem,
    onNewLeader
  }
}

const lots = createLots();

export default lots;