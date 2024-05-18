import colors from "$lib/colors";
import type { ILot } from "$lib/interfaces";
import { getContrastColor, getRandomColor } from "$lib/utils";
import { writable } from "svelte/store";
import signal from "./signal";
import db from "$lib/db";
// import wordList from '../../../../../words/words.json';

// const tempLots = Array.from(new Array(100), (_, id) => {
//   const color = getRandomColor(colors);
//   const contrastColor = getContrastColor(color);

//   return {
//     id: id + 1,
//     title: wordList.words[Math.floor(Math.random() * wordList.words.length)].word,
//     value: Math.floor(Math.random() * 100),
//     donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
//     color,
//     contrastColor,
//   }
// });

function createLots() {
  const lots = writable<ILot[]>([]);
  const itemAdded = signal(writable<ILot | undefined>());
  const lotValueChanged = signal(writable<ILot & { addedValue?: number } | undefined>());

  // let generatedId = tempLots.length;
  let generatedId = 0;
  let color = '';

  async function loadDatabaseItems() {
    const dbItems = await db.lots.toArray();
    const lotWithHighestId = await db.lots.orderBy('id').reverse().first();

    lots.set(dbItems);
    generatedId = lotWithHighestId?.id || 0;
  }

  async function add(title: string, value: number, donator?: string) {
    generatedId += 1;
    color = getRandomColor(colors);

    const item: ILot = {
      id: generatedId,
      title,
      value,
      donators: (donator ? [donator] : []),
      color,
      contrastColor: getContrastColor(color)
    };

    lots.update((items) => {
      const randomIdx = Math.floor(Math.random() * items.length);

      return [...items.slice(0, randomIdx), item, ...items.slice(randomIdx)];
    });

    itemAdded.set(item);
    await db.lots.add(item);
  }

  async function remove(id: number) {
    lots.update((items) => items.filter(item => item.id !== id));
    await db.lots.delete(id);
  }

  async function removeAll() {
    generatedId = 0;
    lots.set([]);
    await db.lots.clear();
  }

  async function setTitle(id: number, title: string) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      return { ...item, title };
    }));

    await db.lots.update(id, { title });
  }

  async function addValue(id: number, value: number, donator?: string) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      lotValueChanged.set({ ...item, addedValue: value });
      db.lots.update(id, { value: item.value + value });

      if (donator && !item.donators.includes(donator)) {
        return { ...item, value: item.value + value, donators: [...item.donators, donator] }
      }

      return { ...item, value: item.value + value };
    }));


  }

  async function setValue(id: number, value: number) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      if (item.value !== value) {
        lotValueChanged.set({ ...item, addedValue: value - item.value });
      }

      return { ...item, value };
    }));

    await db.lots.update(id, { value });
  }

  return {
    subscribe: lots.subscribe,
    add,
    remove,
    removeAll,
    setTitle,
    addValue,
    setValue,
    loadDatabaseItems,
    lotValueChanged,
    itemAdded,
  }
}

const lots = createLots();

export default lots;