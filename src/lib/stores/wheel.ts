import { derived, writable } from 'svelte/store';
import { WHEEL_STATE } from '$lib/constants';
import settings from './settings';

function createWheel() {
  const state = writable(WHEEL_STATE.IDLE);
  const angle = writable(0);
  const normalizedAngle = derived(angle, ($angle) => {
    const angleModulo = Math.abs($angle % 360);
    const isClockwiseRotation = $angle >= 0;

    return isClockwiseRotation ? 360 - angleModulo : angleModulo;
  })

  const maxSpeed = 5;
  const accelerationTime = 0.1;
  const decelerationTime = 0.3;
  const slowDownTime = 0.6;
  const generalTime = accelerationTime + slowDownTime;

  let spinDuration = 10;
  let speed = 0;
  let animationId: number;
  let spinStartTime: number;
  let wheelState: WHEEL_STATE;
  let wheelWinnerDelay: { isEnabled: boolean, seconds: number };

  state.subscribe((s) => wheelState = s);
  settings.wheelWinnerDelay.subscribe((store) => {
    wheelWinnerDelay = store;
  });

  function _giveMoment(currentTime: number) {
    if (!spinStartTime) spinStartTime = currentTime;

    const elapsedTime = currentTime - spinStartTime;
    const progress = Math.min(elapsedTime / spinDuration, 1);

    if (progress >= 1) {
      if (wheelWinnerDelay.isEnabled) {
        state.set(WHEEL_STATE.DELAYED);
      } else {
        state.set(WHEEL_STATE.STOPPED);
      }

      cancelAnimationFrame(animationId);
      return;
    } else if (wheelState === WHEEL_STATE.STOPPED) {
      cancelAnimationFrame(animationId);
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

    angle.update((state) => state + speed);
    animationId = requestAnimationFrame(_giveMoment);
  }

  function startSpin(ms: number) {
    if (wheelState === WHEEL_STATE.SPINNING || spinDuration <= 0) return;

    const randomAngle = Math.floor(Math.random() * 360);

    speed = maxSpeed;
    spinStartTime = 0;
    spinDuration = ms;

    angle.set(randomAngle);
    state.set(WHEEL_STATE.SPINNING);

    requestAnimationFrame(_giveMoment);
  }

  function restartSpin(ms: number) {
    // speed = maxSpeed;
    // spinStartTime = 0;
    spinDuration += ms;

    state.set(WHEEL_STATE.SPINNING);

    requestAnimationFrame(_giveMoment);
  }

  function extendSpin(ms: number) {
    spinDuration += ms;
  }

  function stopSpin() {
    cancelAnimationFrame(animationId);

    state.set(WHEEL_STATE.STOPPED);
  }

  return {
    state,
    angle,
    normalizedAngle,
    spinDuration,
    startSpin,
    extendSpin,
    stopSpin,
    restartSpin,
  }
}

const wheel = createWheel();

export default wheel;