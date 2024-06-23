import { derived, get, writable } from 'svelte/store';
import settings from './settings';
import { TIMER_STATE } from '$lib/constants';
import { formatTime } from '$lib/utils';

function createCountdownTimer() {
  const state = writable(TIMER_STATE.IDLE);
  const time = writable(0);
  const formattedTime = derived(time, ($time) => formatTime($time));

  let baseTime = 0;
  let animationId = 0;
  let animationStartTime = 0;
  let animationPausedTime = 0;
  let startTime = baseTime;
  // let prevState: TIMER_STATE;
  let _state: TIMER_STATE;

  state.subscribe((newState) => {
    // if (!_isChangingTime()) prevState = _state || newState;
    _state = newState;
  });
  settings.timerBaseTime.subscribe((s) => {
    const minutesInMs = s * 1000 * 60;

    if (_state === TIMER_STATE.RUNNING) reset();
    baseTime = minutesInMs;
    startTime = baseTime;
    time.set(minutesInMs);
  });

  function tick(now: number) {
    const elapsedTime = now - animationStartTime;
    const remaining = startTime - elapsedTime;

    if (remaining <= 0) {
      stop();
      return;
    };

    switch (_state) {
      case TIMER_STATE.IDLE: {
        stop();

        break;
      }
      case TIMER_STATE.RUNNING: {
        time.set(Math.round(remaining));

        break;
      }
    }

    animationId = requestAnimationFrame(tick);
  }

  // function _isChangingTime() {
  //   return _state === TIMER_STATE.DECREASING || _state === TIMER_STATE.INCREASING;
  // }

  function stop() {
    cancelAnimationFrame(animationId);

    animationPausedTime = 0;
    startTime = 0;
    time.set(0);
    state.set(TIMER_STATE.IDLE);
  }

  function start(ms?: number) {
    if (ms) setTime(ms);

    animationStartTime = performance.now() - animationPausedTime;
    state.set(TIMER_STATE.RUNNING);
    requestAnimationFrame(tick);
  }

  function pause() {
    if (_state === TIMER_STATE.PAUSED) return;

    cancelAnimationFrame(animationId);
    animationPausedTime = performance.now() - animationStartTime;

    state.set(TIMER_STATE.PAUSED);
  }

  function add(ms: number) {
    // state.set(TIMER_STATE.INCREASING);

    startTime += ms;
    time.update((prevTime) => prevTime + ms);

    // state.set(prevState);
  }

  function subtract(ms: number) {
    if (get(time) <= 0) return;

    // state.set(TIMER_STATE.DECREASING);

    startTime = Math.max(0, startTime - ms);
    time.update((prevTime) => Math.max(0, prevTime - ms));

    // state.set(prevState);
  }

  function reset() {
    cancelAnimationFrame(animationId);
    animationPausedTime = 0;

    startTime = baseTime;
    time.set(baseTime);

    state.set(TIMER_STATE.IDLE);
  }

  function setTime(ms: number) {
    // state.set(TIMER_STATE.DECREASING);

    startTime = ms;
    time.set(ms);

    // state.set(prevState);
  }

  return {
    baseTime,
    time,
    state,
    formattedTime,
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
