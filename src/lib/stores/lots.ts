import { colors } from "$lib/constants";
import type { ILot } from "$lib/interfaces";
import { compareStrings, extractUrl, getContrastColor, getPercentFromTotal, getRandomColor, getTotal } from "$lib/utils";
import { get, writable } from "svelte/store";
import db from "$lib/db";
import storable from "./storable";

function createLots() {
  const lots = writable<ILot[]>([]);
  const isLoading = writable(true);

  const lastAddedItem = writable<ILot | undefined>(undefined);
  const lastUpdatedItem = writable<(ILot & { addedValue: number }) | undefined>();
  const currentLeader = storable<ILot | null>(null, 'currentLeader');

  let lotId = 0;
  let _lots: ILot[] = [];
  let lastAddedItemTimeout: NodeJS.Timeout;
  let lastUpdatedItemTimeout: NodeJS.Timeout;

  lots.subscribe((store) => _lots = store);

  function _getNewLotId() {
    lotId += 1;

    return lotId;
  }

  function _setLastUpdatedItem(lot: ILot & { addedValue: number }) {
    lastUpdatedItem.set(lot);

    clearTimeout(lastUpdatedItemTimeout);
    lastUpdatedItemTimeout = setTimeout(() => {
      lastUpdatedItem.set(undefined);
    }, 100);
  }
  function _setLastAddedItem(lot: ILot) {
    lastAddedItem.set(lot);

    clearTimeout(lastAddedItemTimeout);
    lastAddedItemTimeout = setTimeout(() => {
      lastAddedItem.set(undefined);
    }, 100);
  }

  function _findLotBySimilarity(message: string): ILot | undefined {
    const MERGE_THRESHOLD = 60;

    for (const item of _lots) {
      if (item.title === message) return item;

      const comparePercent = compareStrings(message, item.title);

      if (comparePercent > MERGE_THRESHOLD) return item;
    }
  }
  function _findLotByText(message: string) {
    return _lots.find((item) => item.title.toLowerCase() === message.toLowerCase());
  }
  function _findLotById(id: number) {
    return _lots.find((item) => item.id === id);
  }

  function _findNewLeader(): ILot | null {
    const items = [..._lots].sort((a, b) => b.value - a.value);
    const newLeader = items[0] || null;

    return newLeader;
  }
  function _updateLeader(lot: ILot) {
    const previousLeader = get(currentLeader);

    if (!previousLeader) {
      currentLeader.set(lot);
      return;
    }

    const isSameId = lot.id === previousLeader?.id;
    const isItemHaveMoreValue = lot.value > previousLeader.value;

    if (!isSameId && isItemHaveMoreValue) currentLeader.set(lot);
  }

  function _updateLotsPercents() {
    const lotsValues = _lots.map((item) => item.value);
    const total = getTotal(lotsValues);

    lots.update((items) => items.map((item) => ({
      ...item,
      percent: getPercentFromTotal(item.value, total),
    })));
  }

  async function loadDatabaseItems() {
    isLoading.set(true);

    const dbItems = await db.lots.toArray();
    const lotWithHighestId = await db.lots.orderBy('id').last();

    lotId = lotWithHighestId?.id || 0;
    lots.set(dbItems);
    _updateLotsPercents();

    isLoading.set(false);
  }

  function getSimilarLot(str: string, shouldFindById: boolean) {
    let lot: ILot | undefined;

    if (shouldFindById) {
      const lotId = str.match(/\B(\#[\d]+\b)(?!;)/);
      const replacedLotId = lotId && Number(lotId[0].replace('#', ''));

      if (replacedLotId) lot = _findLotById(replacedLotId);
    }

    return {
      lot: lot || _findLotByText(str),
      mostSimilarLot: _findLotBySimilarity(str),
    }
  }

  async function add(title: string, value: number, donator?: string) {
    const color = getRandomColor(colors);
    const item: ILot = {
      id: _getNewLotId(),
      title,
      value,
      percent: '0%',
      donators: donator ? [donator] : [],
      color,
      contrastColor: getContrastColor(color),
      url: extractUrl(title),
    };

    lots.update((items) => {
      const randomIdx = Math.floor(Math.random() * items.length);

      return [...items.slice(0, randomIdx), item, ...items.slice(randomIdx)];
    });

    _setLastAddedItem(item);
    _updateLeader(item);
    _updateLotsPercents();

    await db.lots.add(item);
  }

  async function removeAll() {
    lotId = 0;
    currentLeader.set(null);
    lots.set([]);

    await db.lots.clear();
  }

  async function remove(id: number) {
    const previousLeader = get(currentLeader);

    lots.update((items) => items.filter(item => item.id !== id));

    if (id === previousLeader?.id) {
      const newLeader = _findNewLeader();

      currentLeader.set(newLeader);
    }
    _updateLotsPercents();

    await db.lots.delete(id);
  }

  async function setTitle(id: number, title: string) {
    const updatedLot = updateLot(id, (item) => ({ ...item, title }));

    if (!updatedLot) return;

    await db.lots.update(id, { title });
  }

  async function addValue(id: number, value: number, donator?: string) {
    const { updatedLot } = updateLot(id, (item) => {
      const summedValue = item.value + value;
      const isNewDonator = donator && !item.donators.includes(donator);

      if (isNewDonator) {
        return { ...item, value: summedValue, donators: [...item.donators, donator] };
      }

      return { ...item, value: summedValue };
    });

    if (!updatedLot) return;

    await db.lots.update(id, { value: updatedLot.value });
  }

  async function setValue(id: number, value: number) {
    const { updatedLot } = updateLot(id, (item) => ({ ...item, value }));

    if (!updatedLot) return;

    await db.lots.update(id, { value });
  }

  function updateLot(id: number, updater: (previousLot: ILot) => ILot) {
    let notUpdatedLot: ILot | undefined;
    let updatedLot: ILot | undefined;

    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      notUpdatedLot = item;
      updatedLot = updater(item);

      return updatedLot;
    }));

    if (updatedLot && notUpdatedLot) {
      const isLotValueChanged = updatedLot.value > notUpdatedLot.value;

      if (isLotValueChanged) {
        const addedValue = notUpdatedLot.value - updatedLot.value;
        _setLastUpdatedItem({ ...updatedLot, addedValue });
      }

      _updateLeader(updatedLot);
      _updateLotsPercents();
    }

    return { notUpdatedLot, updatedLot };
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
    getSimilarLot,
    isLoading,
    lastUpdatedItem,
    lastAddedItem,
    currentLeader,
  }
}

const lots = createLots();

export default lots;