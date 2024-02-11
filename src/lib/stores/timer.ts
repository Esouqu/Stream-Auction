import type { ICountdownTimerState } from '$lib/interfaces';
import { derived, get, writable } from 'svelte/store';
import lots from './lots';
import wheel from './wheel';
import { WHEEL_STATE } from '$lib/constants';
import storable from './storable';

function createCountdownTimer() {
  const baseTime = storable(10, 'baseTime');
  const baseTimeInMs = derived(baseTime, ($baseTime) => $baseTime * 1000 * 60);
  const timer = writable<ICountdownTimerState>({
    timeRemaining: get(baseTimeInMs),
    isRunning: false,
  });

  const itemAddedAction = storable({
    isEnabled: true,
    seconds: 60,
  }, 'itemAddedAction');
  const leaderChangedAction = storable({
    isEnabled: true,
    seconds: 120,
  }, 'leaderChangedAction');

  let animationId = 0;
  let animationStartTime = 0;
  let animationPausedTime = 0;
  let currentTime = get(baseTimeInMs);

  let wheelState: WHEEL_STATE;

  function init() {
    wheel.state.subscribe((s) => wheelState = s);
    wheel.spinStarted.subscribe(({ ms }) => _startOnSpinStarted(ms));
    wheel.spinStopped.subscribe(() => reset());
    wheel.spinExtended.subscribe(({ ms }) => add(ms));
    lots.itemAdded.subscribe(() => _addTimeOnItemAdded());
    lots.leaderChanged.subscribe(() => _addTimeOnLeaderChanged());
  }

  function tick(frameTIme: number) {
    const elapsedTime = frameTIme - animationStartTime;

    timer.update((state) => {
      const remaining = currentTime - elapsedTime;

      if (remaining <= 0) {
        reset();

        return { timeRemaining: 0, isRunning: false };
      }

      animationId = requestAnimationFrame(tick);

      return { ...state, timeRemaining: Math.round(remaining) };
    })
  }

  function start() {
    timer.update((state) => {
      if (state.isRunning || state.timeRemaining <= 0) return state;
      animationStartTime = performance.now() - animationPausedTime;

      requestAnimationFrame(tick);

      return { ...state, isRunning: true }
    })
  }

  function pause() {
    timer.update((state) => {
      animationPausedTime = performance.now() - animationStartTime;

      // DON"T FORGET TO CHECK (TIMER.SET ???)
      if (state.isRunning) {
        cancelAnimationFrame(animationId);
        timer.set({ timeRemaining: state.timeRemaining, isRunning: false });
      }

      return { ...state, isRunning: false };
    })
  }

  function add(ms: number) {
    currentTime += ms;
    timer.update((state) => ({ ...state, timeRemaining: state.timeRemaining + ms }));
  }

  function subtract(ms: number) {
    timer.update((state) => {
      if (state.timeRemaining > 0) {
        currentTime -= ms;

        return { ...state, timeRemaining: Math.max(0, state.timeRemaining - ms) };
      } else {
        return state;
      }
    });
  }

  function setInitialTime(minutes: number) {
    if (get(timer).isRunning) reset();

    baseTime.set(minutes);
    currentTime = get(baseTimeInMs);
    timer.update((state) => ({ ...state, timeRemaining: get(baseTimeInMs) }));
  }

  function setTime(ms: number) {
    currentTime = ms;
    timer.update((state) => ({ ...state, timeRemaining: ms }));
  }

  function reset() {
    currentTime = get(baseTimeInMs);
    animationPausedTime = 0;
    cancelAnimationFrame(animationId);
    timer.set({ timeRemaining: get(baseTimeInMs), isRunning: false });
  }

  function _startOnSpinStarted(ms: number) {
    reset();
    setTime(ms);
    start();
  }

  function _addTimeOnItemAdded() {
    const { isEnabled, seconds } = get(itemAddedAction);

    if (!get(timer).isRunning || wheelState === WHEEL_STATE.SPINNING || !isEnabled) return;

    add(seconds * 1000);
  }

  function _addTimeOnLeaderChanged() {
    const { isEnabled, seconds } = get(leaderChangedAction);

    if (!get(timer).isRunning || wheelState === WHEEL_STATE.SPINNING || !isEnabled) return;

    add(seconds * 1000);
  }

  return {
    subscribe: timer.subscribe,
    start,
    pause,
    add,
    subtract,
    reset,
    setInitialTime,
    setTime,
    itemAddedAction,
    leaderChangedAction,
    baseTime,
    init
  };
};

const timer = createCountdownTimer();

export default timer;
