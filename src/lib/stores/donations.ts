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
    setValue
  }
}

const donations = createDonations();

export default donations;