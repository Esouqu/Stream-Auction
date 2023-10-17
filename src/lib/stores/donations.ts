import { writable } from 'svelte/store';
import type { IDonationData } from '../interfaces';

function createDonations() {
  const { subscribe, update } = writable<IDonationData[]>([]);

  function add(donation: IDonationData) {
    update((donations) => [...donations, donation]);
  }
  function remove(id: number) {
    update((donations) => donations.filter((don) => don.id !== id));
  }

  function onNewDonation(callback: (dTiming: number, dValue: number) => void) {
    update((state) => {
      for (let i = 0; i < state.length; i++) {
        const donation = state[i];
        const donationCreateTime = new Date(donation.created_at + ' UTC').getTime();
        const donationValue = donation.amount_in_user_currency;

        callback(donationCreateTime, donationValue);
      }

      return state
    })
  }

  return {
    subscribe,
    add,
    remove,
    onNewDonation
  }
}

const donations = createDonations();

export default donations;