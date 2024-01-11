import type { IDonationData, ILot } from '../interfaces';
import { get, writable } from 'svelte/store';
import { WHEEL_STATE } from '$lib/constants';
import signal from './signal';
import lots from './lots';
import wheel from './wheel';
import storable from './storable';

interface IProcessedDonationData {
  donation: IDonationData;
  lot?: ILot;
  spinSeconds: number;
  shouldStop: boolean;
  shouldContinue: boolean;
}

function createDonations() {
  const { subscribe, update } = writable<IDonationData[]>([]);
  const donationQueued = signal(writable<IProcessedDonationData>());

  const stopSpinAction = storable({
    isEnabled: true,
    price: 5000,
  }, 'stopSpinAction');
  const continueSpinAction = storable({
    isEnabled: true,
    seconds: 60,
    price: 30,
    step: 10,
  }, 'continueSpinAction');
  const currentSpinPrice = writable(get(continueSpinAction).price);

  let wheelState: WHEEL_STATE;

  function init() {
    wheel.state.subscribe((s) => wheelState = s);
  }

  function add(donation: IDonationData) {
    const processededDonation = processDonation(donation);

    if (processededDonation.isInstant) {
      setTimeout(() => remove(donation.id), 5000);
    }

    update((donations) => {
      const newDonation = {
        ...donation,
        isInstant: processededDonation.isInstant,
        message: processededDonation.message
      };

      return [...donations, newDonation];
    });

    donationQueued.set({ ...processededDonation });
  }

  function processDonation(donation: IDonationData) {
    const { isEnabled: isStopEnabled, price: stopSpinPrice } = get(stopSpinAction);
    const {
      isEnabled: isContinueEnabled,
      step: priceStep,
      seconds: spinSeconds
    } = get(continueSpinAction);
    const currentPrice = get(currentSpinPrice);
    const canStopSpin = isStopEnabled && donation.amount_in_user_currency >= stopSpinPrice;
    const canContinueSpin = isContinueEnabled && donation.amount_in_user_currency >= currentPrice;

    let data: IProcessedDonationData = {
      donation,
      lot: lots.getSimilarLot(donation.message),
      spinSeconds,
      shouldStop: false,
      shouldContinue: false,
    }

    if (wheelState === WHEEL_STATE.SPINNING) {
      data.shouldStop = canStopSpin;
      data.shouldContinue = canContinueSpin;

      if (canContinueSpin) {
        currentSpinPrice.set(currentPrice + priceStep);
      }
    }

    // isInstant indicates that donation will be added automatically
    if (canStopSpin && wheelState === WHEEL_STATE.SPINNING) {
      return {
        ...data,
        isInstant: true,
        message: data.lot ? data.lot.title : donation.message
      }
    };
    if (!data.lot) return {
      ...data,
      isInstant: false,
      message: donation.message
    };
    return {
      ...data,
      isInstant: true,
      message: data.lot.title
    };
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
    donationQueued,
    stopSpinAction,
    continueSpinAction,
    currentSpinPrice,
    init
  }
}

const donations = createDonations();

export default donations;