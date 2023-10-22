import { writable } from 'svelte/store';

interface ICountdownTimerState {
  isRunning: boolean;
  timeRemaining: number;
}

function createCountdownTimer(initialTime: number) {
  const { subscribe, set, update } = writable<ICountdownTimerState>({
    timeRemaining: initialTime,
    isRunning: false,
  });

  let animationId = 0;
  let animationStartTime = 0;
  let animationPausedTime = 0;
  let currentTime = initialTime;
  let currentInitialTime = initialTime;

  function tick(frameTIme: number) {
    const elapsedTime = frameTIme - animationStartTime;

    update((state) => {
      const remaining = currentTime - elapsedTime;

      if (remaining <= 0) {
        resetTime();

        return { timeRemaining: 0, isRunning: false };
      }

      animationId = requestAnimationFrame(tick);

      return { ...state, timeRemaining: Math.round(remaining) };
    })
  }

  function start() {
    update((state) => {
      if (state.isRunning || state.timeRemaining <= 0) return state;
      animationStartTime = performance.now() - animationPausedTime;

      requestAnimationFrame(tick);

      return { ...state, isRunning: true }
    })
  }

  function reset() {
    resetTime(currentInitialTime);
    set({ timeRemaining: currentInitialTime, isRunning: false });
  }

  function pause() {
    update((state) => {
      animationPausedTime = performance.now() - animationStartTime;
      if (state.isRunning) {
        cancelAnimationFrame(animationId);
        set({ timeRemaining: state.timeRemaining, isRunning: false });
      }

      return { ...state, isRunning: false };
    })
  }

  function add(ms: number) {
    currentTime += ms;
    update((state) => ({ ...state, timeRemaining: state.timeRemaining + ms }));
  }

  function subtract(ms: number) {
    update((state) => {
      currentTime -= ms;

      if (state.timeRemaining <= 0) {
        resetTime();

        return { timeRemaining: 0, isRunning: false }
      }

      return { ...state, timeRemaining: Math.max(0, state.timeRemaining - ms) };
    });
  }

  function setInitialTime(ms: number) {
    currentTime = ms;
    currentInitialTime = ms;
    update((state) => ({ ...state, timeRemaining: ms }));
  }

  function setTime(ms: number) {
    currentTime = ms;
    update((state) => ({ ...state, timeRemaining: ms }));
  }

  function resetTime(t: number = 0) {
    currentTime = t;
    animationPausedTime = 0;
    cancelAnimationFrame(animationId);
  }

  return {
    subscribe,
    start,
    pause,
    add,
    subtract,
    reset,
    setInitialTime,
    setTime
  };
};

const timer = createCountdownTimer(10 * 1000 * 60);

export default timer;
