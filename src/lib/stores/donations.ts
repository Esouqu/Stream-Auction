import type { IProcessedDonationData } from '../interfaces';
import { writable } from 'svelte/store';
import signal from './signal';

function createDonations() {
  const { subscribe, update } = writable<IProcessedDonationData[]>([]);
  const itemAdded = signal(writable<IProcessedDonationData | undefined>());
  const instantDonationDeletionTime = 7000;

  function add(donation: IProcessedDonationData) {
    update((donations) => [...donations, donation]);

    if (donation.isInstant) {
      setTimeout(() => remove(donation.id), instantDonationDeletionTime);
    }

    itemAdded.set(donation);
  }

  function remove(id: number | string) {
    update((donations) => donations.filter((d) => d.id !== id));
  }

  function setValue(id: number, value: number) {
    update((donations) => donations.map((donation) => {
      if (donation.id !== id) return donation;

      return { ...donation, amount: value, amount_in_user_currency: value };
    }));
  }

  return {
    subscribe,
    add,
    remove,
    setValue,
    itemAdded,
  }
}

const donations = createDonations();

export default donations;