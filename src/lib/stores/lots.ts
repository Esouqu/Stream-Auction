import colors from "$lib/colors";
import type { ILot } from "$lib/interfaces";
import { getContrastColor, getRandomColor, getRandomInRange } from "$lib/utils";
import { writable } from "svelte/store";
import signal from "./signal";
import db from "$lib/db";
import { dev } from "$app/environment";

function generateRandomWord(length: number) {
  const charset = "abcdefghijklmnopqrstuvwxyz";
  let randomWord = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomWord += charset.charAt(randomIndex);
  }

  return randomWord;
}

const tempLots = Array.from(new Array(100), (_, id) => {
  const color = getRandomColor(colors);
  const contrastColor = getContrastColor(color);
  const randomWord = generateRandomWord(getRandomInRange(5, 10));

  return {
    id: id + 1,
    title: randomWord,
    value: Math.floor(Math.random() * 100),
    donators: ['Archiedos', 'Cake', 'xQc', 'pokelawls'],
    color,
    contrastColor,
  }
});

function createLots() {
  const lots = writable<ILot[]>(dev ? tempLots : []);
  const isLoading = writable(true);
  const itemAdded = signal(writable<ILot | undefined>());
  const lotValueChanged = signal(writable<ILot & { addedValue?: number } | undefined>());

  let generatedId = dev ? tempLots.length : 0;
  let color = '';

  async function loadDatabaseItems() {
    if (dev) return;

    isLoading.set(true);

    const dbItems = await db.lots.toArray();
    const lotWithHighestId = await db.lots.orderBy('id').reverse().first();

    lots.set(dbItems);
    generatedId = lotWithHighestId?.id || 0;

    isLoading.set(false);
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
    isLoading,
    lotValueChanged,
    itemAdded,
  }
}

const lots = createLots();

export default lots;