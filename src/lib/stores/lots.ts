import type { ILot, IPieItem } from "$lib/interfaces";
import { writable } from "svelte/store";

const tempLots = [
  {
    id: 1,
    title: 'Папины дочки. Новые (сериал 2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 2,
    title: 'Феррари (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 3,
    title: 'Мастер и Маргарита (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 4,
    title: 'Гуррен Лаганн',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 5,
    title: 'Три мушкетёра: Миледи (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 6,
    title: 'Сто лет тому вперёд',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 7,
    title: 'Холоп 2 (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 8,
    title: 'Самая большая луна (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 9,
    title: 'Гардемарины 1787. Мир (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 10,
    title: 'Гладиатор',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 11,
    title: 'Папины дочки. Новые (сериал 2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 12,
    title: 'Феррари (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 13,
    title: 'Мастер и Маргарита (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 14,
    title: 'Дворец (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 15,
    title: 'Три мушкетёра: Миледи (2023)',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
  {
    id: 16,
    title: 'Сто лет тому вперёд',
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
  },
];

function createLots() {

  // need to shuffleArray

  const { subscribe, update } = writable<ILot[]>(tempLots);

  let id = tempLots.length;

  function addItem(title: string, value: number, donator?: string) {
    id += 1;

    update((lots) => {
      const randomIdx = Math.floor(Math.random() * lots.length);
      const newLot = { id, title, value, donators: donator ? [donator] : [] };

      return [...lots.slice(0, randomIdx), newLot, ...lots.slice(randomIdx)];
    });
  }

  function removeItem(id: number) {
    update((items) => items.filter(item => item.id !== id));
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

  return {
    subscribe,
    addItem,
    removeItem,
    setTitle,
    addValue,
    setValue,
    subtractValue,
  }
}

const lots = createLots();

export default lots;