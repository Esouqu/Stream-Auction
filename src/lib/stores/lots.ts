import { greenlessColors } from "$lib/colors";
import type { IDonationData, ILot } from "$lib/interfaces";
import { compareStrings, extractUrl, getContrastColor, getRandomColor } from "$lib/utils";
import { get, writable } from "svelte/store";
import signal from "./signal";
import donations from "./donations";
// import wordList from '../../../../words/words.json';

// const tempLots = Array.from(new Array(55), (_, id) => {
//   const color = getRandomColor(greenlessColors);
//   const contrastColor = getContrastColor(color);

//   return {
//     id,
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
  const leaderChanged = signal(writable<ILot | undefined>());
  const lotValueChanged = signal(writable<{ id: number } | undefined>());
  // const greenlessMode = storable(false, 'greenlessMode');

  // let generatedId = tempLots.length;
  let generatedId = 0;
  let color = '';

  function init() {
    donations.donationQueued.subscribe(({ lot, donation, shouldStop }) => {
      _handleLotOnStop(lot, donation, shouldStop);

      if (lot) addValue(lot.id, donation.amount_in_user_currency, donation.username);
    });
  }

  function add(title: string, value: number, donator?: string) {
    generatedId += 1;
    color = getRandomColor(greenlessColors);

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
      _detectNewLeader(items, item);

      return [...items.slice(0, randomIdx), item, ...items.slice(randomIdx)];
    });

    itemAdded.set(item);
  }

  function remove(id: number) {
    lots.update((items) => items.filter(item => item.id !== id));
  }

  function removeAll() {
    generatedId = 0;
    lots.set([]);
  }

  function setTitle(id: number, title: string) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      return { ...item, title };
    }));
  }

  function addValue(id: number, value: number, donator?: string) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      _detectNewLeader(items, { ...item, value: item.value + value });

      if (donator && !item.donators.includes(donator)) {
        return { ...item, value: item.value + value, donators: [...item.donators, donator] }
      }

      return { ...item, value: item.value + value };
    }));

    lotValueChanged.set({ id });
  }

  function setValue(id: number, value: number) {
    lots.update((items) => items.map((item) => {
      if (item.id !== id) return item;

      if (item.value !== value) {
        _detectNewLeader(items, { ...item, value });
        lotValueChanged.set({ id });
      }

      return { ...item, value };
    }));
  }

  function getSimilarLot(str: string) {
    const lotId = str.match(/\B(\#[\d]+\b)(?!;)/);
    const replacedLotId = lotId && Number(lotId[0].replace('#', ''));
    const url = extractUrl(str);

    if (url) {
      // if message have exact same url as one of the lots
      return _findSameLot(url);
    } else if (replacedLotId && replacedLotId <= get(lots).length) {
      // If message have [#id]. get(lots).length = last generated lot id
      return _findLotById(replacedLotId);
    } else {
      // else try to find lot by strings similarity
      return _findLotBySimilarity(str);
    }
  }

  function _findSameLot(message: string) {
    return get(lots).find((item) => item.title.includes(message));
  }

  function _findLotById(id: number) {
    return get(lots).find((item) => item.id === id);
  }

  function _findLotBySimilarity(message: string): ILot | undefined {
    const minMergeThreshold = 40;
    const maxMergeThreshold = 60;

    let acceptableLots: (ILot & { comparePercent: number })[] = [];

    for (const l of get(lots)) {
      const comparePercent = compareStrings(message, l.title);

      if (comparePercent > maxMergeThreshold) {
        acceptableLots = [];

        return l;
      }

      if (comparePercent > minMergeThreshold) {
        acceptableLots.push({ ...l, comparePercent });
      }
    }

    if (acceptableLots.length > 0) {
      return acceptableLots.reduce((prev, current) =>
        prev.comparePercent > current.comparePercent ? prev : current
      );
    }
  }

  function _detectNewLeader(items: ILot[], item: ILot) {
    const maxValue = Math.max(...items.map((l) => l.value));

    if (item.value > maxValue && get(leaderChanged)?.id !== item.id) {
      leaderChanged.set(item)
    };
  }

  function _handleLotOnStop(lot: ILot | undefined, donation: IDonationData, shouldStop: boolean) {
    if (!shouldStop) return;

    if (lot) {
      addValue(lot.id, donation.amount_in_user_currency, donation.username);
    } else {
      add(donation.message, donation.amount_in_user_currency, donation.username);
    }
  }

  // function refreshColors() {
  //   const isGreenlessMode = get(greenlessMode);
  //   const colorSet = isGreenlessMode ? greenlessColors : colors;

  //   lots.update((items) => items.map((i) => {
  //     color = getRandomColor(colorSet);

  //     return {
  //       ...i,
  //       color,
  //       contrastColor: getContrastColor(color)
  //     }
  //   }))
  // }

  return {
    subscribe: lots.subscribe,
    add,
    remove,
    removeAll,
    setTitle,
    addValue,
    setValue,
    itemAdded,
    leaderChanged,
    lotValueChanged,
    getSimilarLot,
    init
  }
}

const lots = createLots();

export default lots;