import { writable } from 'svelte/store';
import donations from './donations';
import settings from './settings';
import timer from './timer';
import wheel from './wheel';
import lots from './lots';
import type { IDonationData, ILot } from '$lib/interfaces';
import { compareStrings } from '$lib/utils';
import { ACTION_MANAGER_STATE, WHEEL_STATE } from '$lib/constants';

interface ISetting {
  isEnabled: boolean;
  seconds: number;
}

function createActionManager() {
  const state = writable(ACTION_MANAGER_STATE.IDLE);

  let _state: ACTION_MANAGER_STATE = ACTION_MANAGER_STATE.IDLE;
  let _lots: ILot[] = [];
  let _previousLotsLeader: ILot;
  let _wheelWinnerDelay: ISetting;
  let _extendSpinAction: ISetting & { price: number; step: number };
  let _stopSpinAction: { isEnabled: boolean; price: number };
  let _itemAddedAction: ISetting;
  let _leaderChangedAction: ISetting;
  let _addByIdAction: boolean;
  let _currentExtendSpinPrice: number;
  let _wheelWinnerDelayTimeout: NodeJS.Timeout;

  function initialize() {
    state.subscribe((store) => _state = store);
    lots.subscribe((store) => {
      const newLeader = [...store].sort((a, b) => b.value - a.value)[0];

      if (_state === ACTION_MANAGER_STATE.AUCTIONING) {
        if (!_previousLotsLeader && newLeader) _previousLotsLeader = newLeader;

        if (newLeader?.value > _previousLotsLeader.value && _previousLotsLeader.id !== newLeader.id) {
          if (_leaderChangedAction.isEnabled) timer.add(_leaderChangedAction.seconds * 1000);

          _previousLotsLeader = newLeader;
        };

        if (_itemAddedAction?.isEnabled && store.length > _lots.length) timer.add(_itemAddedAction.seconds * 1000);
      }

      _lots = store;
    });
    wheel.state.subscribe((store) => {
      if (store === WHEEL_STATE.STOPPED) {
        state.set(ACTION_MANAGER_STATE.IDLE);
      }

      if (_wheelWinnerDelay?.isEnabled && store === WHEEL_STATE.DELAYED) {
        state.set(ACTION_MANAGER_STATE.DELAYING_WHEEL_WINNER);
        timer.start(_wheelWinnerDelay.seconds * 1000);

        _wheelWinnerDelayTimeout = setTimeout(() => {
          wheel.state.set(WHEEL_STATE.STOPPED);
        }, _wheelWinnerDelay.seconds * 1000);
      }
    });

    settings.wheelWinnerDelay.subscribe((store) => _wheelWinnerDelay = store);
    settings.extendSpinAction.subscribe((store) => _extendSpinAction = store);
    settings.currentExtendSpinPrice.subscribe((store) => _currentExtendSpinPrice = store);
    settings.stopSpinAction.subscribe((store) => _stopSpinAction = store);
    settings.itemAddedAction.subscribe((store) => _itemAddedAction = store);
    settings.leaderChangedAction.subscribe((store) => _leaderChangedAction = store);
    settings.addByIdAction.subscribe((store) => _addByIdAction = store);
  }

  function startAuction() {
    timer.start();
    state.set(ACTION_MANAGER_STATE.AUCTIONING);
  }

  function pauseAuction() {
    timer.pause();
    state.set(ACTION_MANAGER_STATE.IDLE);
  }

  function startWheelSpin(ms: number) {
    timer.reset();
    timer.start(ms);
    state.set(ACTION_MANAGER_STATE.SPINNING_WHEEL);
    wheel.startSpin(ms);
  }

  function stopWheelSpin() {
    timer.reset();
    state.set(ACTION_MANAGER_STATE.IDLE);
    wheel.stopSpin();
  }

  function getSimilarLot(str: string) {
    const lotId = str.match(/\B(\#[\d]+\b)(?!;)/);
    const replacedLotId = lotId && Number(lotId[0].replace('#', ''));
    // const url = extractUrl(str);

    let lot: ILot | undefined;

    if (_addByIdAction && replacedLotId) {
      // If message have [#id]. get(lots).length = last generated lot id
      lot = findLotById(replacedLotId);
    } else {
      // else try to find exact same lot as donation message
      lot = findLotByText(str);
    }

    return {
      lot,
      mostSimilarLot: findLotBySimilarity(str),
    }
  }

  function findLotByText(message: string) {
    return _lots.find((item) => item.title.toLowerCase() === message.toLowerCase());
  }

  function findLotById(id: number) {
    return _lots.find((item) => item.id === id);
  }

  function findLotBySimilarity(message: string): ILot | undefined {
    const MERGE_THRESHOLD = 60;

    for (const l of _lots) {
      if (l.title === message) return l;

      const comparePercent = compareStrings(message, l.title);

      if (comparePercent > MERGE_THRESHOLD) return l;
    }
  }

  function processDonation(donation: IDonationData) {
    const message = donation.message || '';
    const donationAmount = donation.amount_in_user_currency;
    const { lot, mostSimilarLot } = getSimilarLot(message);
    const handleDonation = (wouldSpinStop = false) => {
      if (lot && !wouldSpinStop) {
        lots.addValue(lot.id, donationAmount, donation.username);
      }

      donations.add({
        ...donation,
        mostSimilarLot,
        message: lot && !wouldSpinStop ? lot.title : message,
        isInstant: !!lot && !wouldSpinStop,
      });
    }

    switch (_state) {
      case ACTION_MANAGER_STATE.IDLE:
      case ACTION_MANAGER_STATE.AUCTIONING: {
        handleDonation();

        break;
      }

      case ACTION_MANAGER_STATE.DELAYING_WHEEL_WINNER:
      case ACTION_MANAGER_STATE.SPINNING_WHEEL: {
        const isWheelWinnerDelayed = _state === ACTION_MANAGER_STATE.DELAYING_WHEEL_WINNER;
        const isEnoughAmountToExtend = donationAmount >= _currentExtendSpinPrice;
        const shouldStopSpin = _stopSpinAction.isEnabled && donationAmount === _stopSpinAction.price;
        const shouldExtendSpin = _extendSpinAction.isEnabled && donationAmount >= _currentExtendSpinPrice;

        if (!_extendSpinAction.isEnabled || (!isEnoughAmountToExtend && isWheelWinnerDelayed)) {
          donations.add({
            ...donation,
            isInstant: false,
          });
        } else {
          handleDonation(shouldStopSpin);
        }

        if (shouldStopSpin) {
          wheel.stopSpin();
          timer.reset();
        } else if (shouldExtendSpin) {
          if (isWheelWinnerDelayed) {
            clearTimeout(_wheelWinnerDelayTimeout);
            state.set(ACTION_MANAGER_STATE.SPINNING_WHEEL);
            wheel.restartSpin(_extendSpinAction.seconds * 1000);
            timer.start(_extendSpinAction.seconds * 1000);
          } else {
            wheel.extendSpin(_extendSpinAction.seconds * 1000);
            timer.add(_extendSpinAction.seconds * 1000);
          }

          settings.increaseExtendSpinPrice();
        }

        break;
      }
    }
  }

  return {
    state,
    initialize,
    startWheelSpin,
    stopWheelSpin,
    processDonation,
    startAuction,
    pauseAuction,
  }
}

const actionManager = createActionManager();

export default actionManager;