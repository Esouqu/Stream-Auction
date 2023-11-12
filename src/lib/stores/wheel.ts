import { get, writable } from 'svelte/store';

export enum WHEEL_STATE {
  WAITING,
  SPINNING,
  WINNING,
}

function createWheel() {
  const { subscribe, update } = writable({
    angle: 0,
    normalizedAngle: 0,
  });
  const state = writable(WHEEL_STATE.WAITING);
  const spinDuration = writable(10);

  const maxSpeed = 5;
  const accelerationTime = 0.1;
  const decelerationTime = 0.3;
  const slowDownTime = 0.6;
  const generalTime = accelerationTime + slowDownTime;

  let speed = 0;
  let animationId: number;
  let spinStartTime: number;

  function giveMoment(currentTime: number) {
    if (!spinStartTime) spinStartTime = currentTime;

    const duration = get(spinDuration);
    const elapsedTime = currentTime - spinStartTime;
    const progress = Math.min(elapsedTime / duration, 1);

    if (progress >= 1 || get(state) === WHEEL_STATE.WINNING) {
      stop();

      return;
    }

    if (progress <= accelerationTime) {
      speed = maxSpeed * (progress / accelerationTime);
    } else if (progress > accelerationTime && progress <= generalTime) {
      const slowdownProgress = (progress - accelerationTime) / slowDownTime;
      speed = maxSpeed - slowdownProgress * (maxSpeed - 1);
    } else {
      const slowdownProgress =
        (elapsedTime - duration * generalTime) / (duration * decelerationTime);
      speed = 1 * (1 - slowdownProgress);
    }

    update((state) => {
      const angleModulo = Math.abs((state.angle + speed) % 360);
      const isClockwiseRotation = (state.angle + speed) >= 0;
      const normalizedAngle = isClockwiseRotation ? 360 - angleModulo : angleModulo;

      return { ...state, angle: state.angle + speed, normalizedAngle }
    });

    animationId = requestAnimationFrame(giveMoment);
  }

  function spin(ms: number) {
    if (get(state) === WHEEL_STATE.SPINNING || get(spinDuration) < 1) return;

    const randomAngle = Math.floor(Math.random() * 360);

    speed = maxSpeed;
    state.set(WHEEL_STATE.SPINNING);
    spinDuration.set(ms);

    update(() => ({
      angle: randomAngle,
      normalizedAngle: 0,
    }));

    requestAnimationFrame(giveMoment);
  }

  function setAngle(deg: number) {
    update((state) => ({ ...state, angle: deg }));
  }

  function addSpinDuration(ms: number) {
    spinDuration.update((current) => current + ms)
  }

  function stop() {
    cancelAnimationFrame(animationId);
    spinStartTime = 0;
    state.set(WHEEL_STATE.WINNING);
  }

  function setState(newState: WHEEL_STATE) {
    state.set(newState);
  }

  return {
    subscribe,
    state,
    spinDuration,
    spin,
    addSpinDuration,
    stop,
    setAngle,
    setState
  }
}

const wheel = createWheel();

export default wheel;