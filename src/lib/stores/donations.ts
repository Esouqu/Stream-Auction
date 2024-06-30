import type { IProcessedDonationData } from '../interfaces';
import { writable } from 'svelte/store';

function createDonations() {
  const { subscribe, update } = writable<IProcessedDonationData[]>([]);
  const instantDonationDeleteTime = 7000;

  function add(donation: IProcessedDonationData) {
    update((donations) => [...donations, donation]);

    if (donation.isInstant) {
      setTimeout(() => remove(donation.id), instantDonationDeleteTime);
    }
  }

  function remove(id: number | string) {
    update((donations) => donations.filter((d) => d.id !== id));
  }

  return {
    subscribe,
    add,
    remove,
  }
}

const donations = createDonations();

export default donations;