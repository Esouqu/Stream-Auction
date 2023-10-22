import { writable } from 'svelte/store';
import type { IDonationData } from '../interfaces';

function createDonations() {
  const { subscribe, update } = writable<IDonationData[]>([]);

  function add(donation: IDonationData) {
    update((donations) => [...donations, donation]);
  }
  function remove(id: number | string) {
    update((donations) => donations.filter((don) => don.id !== id));
  }

  return {
    subscribe,
    add,
    remove,
  }
}

const donations = createDonations();

export default donations;