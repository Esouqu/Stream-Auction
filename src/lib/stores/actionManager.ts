import donations from './donations';
import settings from './settings';
import timer from './timer';
import wheel from './wheel';
import lots from './lots';
import type { IDonationData, ILot } from '$lib/interfaces';
import { ACTION_MANAGER_STATE, CENTRIFUGE_STATE, DONATION_EVENT, SOCKET_STATE, TIMER_STATE, WHEEL_STATE } from '$lib/constants';
import intensityTracker from './intensityTracker';
import centrifugo from './centrifugo';

interface ISetting {
  isEnabled: boolean;
  seconds: number;
}

function createActionManager() {
  let _state = ACTION_MANAGER_STATE.IDLE;
  let _largestDonation = 0;

  let wheelState = WHEEL_STATE.IDLE;
  let centrifugoState = SOCKET_STATE.CLOSED;
  let currentExtendSpinPrice: number;
  let spinStopDelay: ISetting;
  let itemAddedAction: ISetting;
  let leaderChangedAction: ISetting;
  let addByIdAction: boolean;
  let stopSpinAction: { isEnabled: boolean; price: number };
  let extendSpinAction: ISetting & {
    price: number;
    stepType: string;
    step: number;
  };
  let intensitySetting: { isEnabled: boolean; price: number };

  function initialize() {
    settings.spinStopDelay.subscribe((store) => spinStopDelay = store);
    settings.extendSpinAction.subscribe((store) => extendSpinAction = store);
    settings.currentExtendSpinPrice.subscribe((store) => currentExtendSpinPrice = store);
    settings.stopSpinAction.subscribe((store) => stopSpinAction = store);
    settings.itemAddedAction.subscribe((store) => itemAddedAction = store);
    settings.leaderChangedAction.subscribe((store) => leaderChangedAction = store);
    settings.addByIdAction.subscribe((store) => addByIdAction = store);
    settings.intensity.subscribe((store) => intensitySetting = store);
    centrifugo.state.subscribe((store) => centrifugoState = store);

    lots.lastAddedItem.subscribe(_handleLastAddedLot);
    lots.lastUpdatedItem.subscribe(_handleLastUpdatedLot);
    lots.currentLeader.subscribe(_handleCurrentLeader);
    timer.state.subscribe(_handleTimerState)
    wheel.state.subscribe(_handleWheelState);
  }

  function _handleWheelState(state: WHEEL_STATE) {
    switch (state) {
      case WHEEL_STATE.SPINNING: {
        _state = ACTION_MANAGER_STATE.SPINNING_WHEEL;
        break;
      }
      case WHEEL_STATE.DELAYED: {
        _state = ACTION_MANAGER_STATE.DELAYING_SPIN_STOP;
        timer.start(spinStopDelay.seconds * 1000);

        break;
      }
      case WHEEL_STATE.STOPPED: {
        _state = ACTION_MANAGER_STATE.IDLE;
        break;
      }
    }

    wheelState = state;
  }

  function _handleTimerState(timerState: TIMER_STATE) {
    const isTimerStopped = timerState === TIMER_STATE.STOPPED;
    const isSpinStopDelayed = wheelState === WHEEL_STATE.DELAYED;

    if (spinStopDelay.isEnabled && centrifugoState === SOCKET_STATE.OPEN) {
      if (isTimerStopped && isSpinStopDelayed) {
        stopWheelSpin();
      }
    } else {
      if (isTimerStopped) {
        stopWheelSpin();
      }
    }
  }

  function _handleLastUpdatedLot(lot?: ILot & { addedValue: number }) {
    if (!lot) return;

    switch (_state) {
      case ACTION_MANAGER_STATE.IDLE:
      case ACTION_MANAGER_STATE.AUCTIONING: {
        increaseIntensity(Math.abs(lot.addedValue));
        break;
      }
    }
  }

  function _handleLastAddedLot(lot?: ILot) {
    if (!lot) return;

    switch (_state) {
      case ACTION_MANAGER_STATE.IDLE: {
        increaseIntensity(lot.value);
        break;
      }
      case ACTION_MANAGER_STATE.AUCTIONING: {
        increaseIntensity(lot.value);

        if (itemAddedAction.isEnabled) {
          timer.add(itemAddedAction.seconds * 1000);
        }

        break;
      }
    }
  }

  function _handleCurrentLeader(lot: ILot | null) {
    switch (_state) {
      case ACTION_MANAGER_STATE.AUCTIONING: {
        if (!leaderChangedAction.isEnabled || !lot) break;

        timer.add(leaderChangedAction.seconds * 1000);
        break;
      }
    }
  }

  function _addLotFromDonation(donation: IDonationData) {
    const donationAmount = donation.amount_in_user_currency;
    const donationMessage = donation.message || '';
    const { lot, mostSimilarLot } = lots.getSimilarLot(donationMessage, addByIdAction);
    const message = lot ? lot.title : donationMessage;
    const isInstant = !!lot;

    if (lot) lots.addValue(lot.id, donationAmount, donation.username);
    donations.add({ ...donation, message, mostSimilarLot, isInstant });
  }
  function _onExtendSpinEvent(spinExtendAmount: number | undefined, shouldRestartSpin: boolean) {
    if (shouldRestartSpin) {
      timer.start(extendSpinAction.seconds * 1000);
      wheel.restartSpin(extendSpinAction.seconds * 1000);
    } else {
      timer.add(extendSpinAction.seconds * 1000);
      wheel.extendSpin(extendSpinAction.seconds * 1000);
    }

    settings.increaseExtendSpinPrice(spinExtendAmount);
  }
  function _activateEvent(donation: IDonationData, donationEvent: DONATION_EVENT, isSpinStopDelayed: boolean) {
    const spinExtendAmount = extendSpinAction.stepType === 'fixed' ? undefined : _largestDonation;

    switch (donationEvent) {
      case DONATION_EVENT.EXTEND: {
        _addLotFromDonation(donation);
        _onExtendSpinEvent(spinExtendAmount, isSpinStopDelayed);
        break;
      }
      case DONATION_EVENT.STOP: {
        donations.add({ ...donation, isInstant: false });
        stopWheelSpin();
        break;
      }
    }
  }
  function _updateLargestDonation(newDonationAmount: number) {
    if (newDonationAmount < _largestDonation) return;

    _largestDonation = newDonationAmount;
  }
  function _getDonationEvent(donationAmount: number) {
    const isExtendSpinEvent = extendSpinAction.isEnabled && donationAmount >= currentExtendSpinPrice;
    const isSpinStopEvent = stopSpinAction.isEnabled && donationAmount === stopSpinAction.price;

    if (isSpinStopEvent) return DONATION_EVENT.STOP;
    if (isExtendSpinEvent) return DONATION_EVENT.EXTEND;
  }

  function _getIntensityLevelsToAdd(addedAmount: number) {
    const priceX4 = intensitySetting.price * 4;
    const priceX3 = intensitySetting.price * 3;
    const priceX2 = intensitySetting.price * 2;

    if (addedAmount >= priceX4) return 4;
    if (addedAmount >= priceX3) return 3;
    if (addedAmount >= priceX2) return 2;
    return 1;
  }

  function increaseIntensity(addedValue: number) {
    if (addedValue < intensitySetting.price) return;

    const levelsToAdd = _getIntensityLevelsToAdd(addedValue);
    intensityTracker.increaseLevel(levelsToAdd);
  }

  function startAuction() {
    _state = ACTION_MANAGER_STATE.AUCTIONING;
    timer.start();
  }
  function pauseAuction() {
    timer.pause();
    _state = ACTION_MANAGER_STATE.IDLE;
  }

  function startWheelSpin(ms: number) {
    _largestDonation = 0;

    timer.reset();
    timer.start(ms);
    wheel.startSpin(ms);
  }
  function stopWheelSpin() {
    timer.reset();
    wheel.stopSpin();

    settings.currentExtendSpinPrice.set(extendSpinAction.price);
  }

  function processDonation(donation: IDonationData) {
    const donationEvent = _getDonationEvent(donation.amount_in_user_currency);

    _updateLargestDonation(donation.amount_in_user_currency);

    switch (_state) {
      case ACTION_MANAGER_STATE.IDLE:
      case ACTION_MANAGER_STATE.AUCTIONING: {
        _addLotFromDonation(donation);
        break;
      }
      case ACTION_MANAGER_STATE.DELAYING_SPIN_STOP: {
        if (!donationEvent) {
          donations.add({ ...donation, isInstant: false });
          break;
        }

        _activateEvent(donation, donationEvent, true);
        break;
      }
      case ACTION_MANAGER_STATE.SPINNING_WHEEL: {
        if (!donationEvent) {
          _addLotFromDonation(donation);
          break;
        }

        _activateEvent(donation, donationEvent, false);
        break;
      }
    }
  }

  return {
    initialize,
    increaseIntensity,
    processDonation,
    startWheelSpin,
    stopWheelSpin,
    startAuction,
    pauseAuction,
  }
}

const actionManager = createActionManager();

export default actionManager;