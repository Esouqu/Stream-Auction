import { get, writable } from 'svelte/store';
import donations from './donations';
import signal from './signal';
import { WHEEL_STATE } from '$lib/constants';

function createWheel() {
  const { subscribe, update } = writable({
    angle: 0,
    normalizedAngle: 0,
  });
  const state = writable(WHEEL_STATE.WAITING);

  // value of signal writable store should be inside the object 
  // so assignment to it would trigger reactivity even if value is the same as previous
  const spinStarted = signal(writable({ ms: 0 }));
  const spinStopped = signal(writable({ ms: 0 }));
  const spinExtended = signal(writable({ ms: 0 }));

  const maxSpeed = 10;
  const accelerationTime = 0.1;
  const decelerationTime = 0.3;
  const slowDownTime = 0.6;
  const generalTime = accelerationTime + slowDownTime;

  let spinDuration = 10;
  let speed = 0;
  let animationId: number;
  let spinStartTime: number;

  function init() {
    donations.donationQueued.subscribe(({ shouldStop, shouldContinue, spinSeconds }) => {
      if (get(state) !== WHEEL_STATE.SPINNING) return;

      if (shouldStop) _stop()
      else if (shouldContinue) _continueSpin(spinSeconds * 1000);
    });
  }

  function startSpin(ms: number) {
    if (get(state) === WHEEL_STATE.SPINNING || spinDuration < 1) return;

    const randomAngle = Math.floor(Math.random() * 360);

    speed = maxSpeed;
    spinDuration = ms;

    update(() => ({
      angle: randomAngle,
      normalizedAngle: 0,
    }));

    state.set(WHEEL_STATE.SPINNING);
    spinStarted.set({ ms });

    requestAnimationFrame(_giveMoment);
  }

  function setAngle(deg: number) {
    update((state) => ({ ...state, angle: deg }));
  }

  function _giveMoment(currentTime: number) {
    if (!spinStartTime) spinStartTime = currentTime;

    const elapsedTime = currentTime - spinStartTime;
    const progress = Math.min(elapsedTime / spinDuration, 1);

    if (progress >= 1 || get(state) === WHEEL_STATE.WINNING) {
      _stop();

      return;
    }

    if (progress <= accelerationTime) {
      speed = maxSpeed * (progress / accelerationTime);
    } else if (progress > accelerationTime && progress <= generalTime) {
      const slowdownProgress = (progress - accelerationTime) / slowDownTime;
      speed = maxSpeed - slowdownProgress * (maxSpeed - 1);
    } else {
      const slowdownProgress =
        (elapsedTime - spinDuration * generalTime) / (spinDuration * decelerationTime);
      speed = 1 * (1 - slowdownProgress);
    }

    update((state) => {
      const angleModulo = Math.abs((state.angle + speed) % 360);
      const isClockwiseRotation = (state.angle + speed) >= 0;
      const normalizedAngle = isClockwiseRotation ? 360 - angleModulo : angleModulo;

      return { ...state, angle: state.angle + speed, normalizedAngle }
    });

    animationId = requestAnimationFrame(_giveMoment);
  }

  function _continueSpin(ms: number) {
    spinDuration += ms;
    spinExtended.set({ ms })
  }

  function _stop() {
    cancelAnimationFrame(animationId);
    spinStartTime = 0;
    state.set(WHEEL_STATE.WINNING);
    spinStopped.set({ ms: 0 });
  }

  return {
    subscribe,
    state,
    spinDuration,
    startSpin,
    setAngle,
    spinStarted,
    spinStopped,
    spinExtended,
    init
  }
}

const wheel = createWheel();

export default wheel;