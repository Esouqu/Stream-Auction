import { get, writable } from 'svelte/store';
import settings from './settings';
import { TIMER_STATE } from '$lib/constants';

function createCountdownTimer() {
  const state = writable(TIMER_STATE.IDLE);
  const time = writable(0);

  let baseTime = 0;
  let animationId = 0;
  let animationStartTime = 0;
  let animationPausedTime = 0;
  let currentTime = baseTime;
  let timerState: TIMER_STATE;

  state.subscribe((s) => timerState = s);
  settings.timerBaseTime.subscribe((s) => {
    const minutesInMs = s * 1000 * 60;

    if (timerState === TIMER_STATE.RUNNING) reset();
    baseTime = minutesInMs;
    currentTime = baseTime;
    time.set(minutesInMs);
  });

  function tick(frameTIme: number) {
    const elapsedTime = frameTIme - animationStartTime;
    const remaining = currentTime - elapsedTime;

    if (remaining <= 0) {
      currentTime = 0;
      animationPausedTime = 0;
      cancelAnimationFrame(animationId);

      time.set(0);
      state.set(TIMER_STATE.IDLE);
    } else {
      time.set(Math.round(remaining));
      animationId = requestAnimationFrame(tick);
    }
  }

  function start(ms?: number) {
    // if (timerState === TIMER_STATE.RUNNING) return;

    if (ms) setTime(ms);

    animationStartTime = performance.now() - animationPausedTime;
    state.set(TIMER_STATE.RUNNING);
    requestAnimationFrame(tick);
  }

  function pause() {
    if (timerState === TIMER_STATE.PAUSED) return;

    animationPausedTime = performance.now() - animationStartTime;
    cancelAnimationFrame(animationId);
    state.set(TIMER_STATE.PAUSED);
  }

  function add(ms: number) {
    currentTime += ms;
    time.update((state) => state + ms);
  }

  function subtract(ms: number) {
    time.update((state) => {
      if (state <= 0) return state;

      currentTime -= ms;

      return Math.max(0, state - ms);
    });
  }

  function reset() {
    cancelAnimationFrame(animationId);
    currentTime = baseTime;
    animationPausedTime = 0;
    time.set(baseTime);
    state.set(TIMER_STATE.IDLE);
  }

  function setTime(ms: number) {
    currentTime = ms;
    time.set(ms);
  }

  return {
    baseTime,
    time,
    state,
    start,
    pause,
    add,
    subtract,
    reset,
    setTime,
  };
};

const timer = createCountdownTimer();

export default timer;
