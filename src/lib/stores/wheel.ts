import { writable } from 'svelte/store';

interface IWheelStore {
  isSpinning: boolean;
  spinStartDateTime: number;
  angle: number;
  normalizedAngle: number;
  spinDuration: number;
}

function createWheel() {
  const { subscribe, update } = writable<IWheelStore>({
    isSpinning: false,
    spinStartDateTime: 0,
    angle: 0,
    normalizedAngle: 0,
    spinDuration: 10,
  });

  const maxSpeed = 5;
  const accelerationTime = 0.2;
  const slowDownTime = 0.5;
  const generalTime = accelerationTime + slowDownTime;
  const decelerationTime = 0.3;

  let speed = 0;
  let animationId: number;
  let spinStartTime: number;

  function giveMoment(currentTime: number) {
    if (!spinStartTime) spinStartTime = currentTime;

    update((state) => {
      if (!state.isSpinning) {
        spinStartTime = 0;

        return state;
      }

      const elapsedTime = currentTime - spinStartTime;
      const progress = Math.min(elapsedTime / state.spinDuration, 1);

      if (progress >= 1) {
        spinStartTime = 0;

        return { ...state, isSpinning: false };
      } else if (progress <= accelerationTime) {
        speed = maxSpeed * (progress / accelerationTime);
      } else if (progress > accelerationTime && progress <= generalTime) {
        const slowdownProgress = (progress - accelerationTime) / slowDownTime;
        speed = maxSpeed - slowdownProgress * (maxSpeed - 1);
      } else {
        const slowdownProgress =
          (elapsedTime - state.spinDuration * generalTime) / (state.spinDuration * decelerationTime);
        speed = 1 * (1 - slowdownProgress);
      }

      const angleModulo = Math.abs(state.angle % 360);
      const isClockwiseRotation = state.angle >= 0;
      const normalizedAngle = isClockwiseRotation ? 360 - angleModulo : angleModulo;
      animationId = requestAnimationFrame(giveMoment);

      return { ...state, angle: state.angle + speed, normalizedAngle }
    });
  }

  function spin(ms: number) {
    const randomAngle = Math.floor(Math.random() * 360);

    update((state) => {
      if (state.isSpinning || state.spinDuration < 1) return state;

      speed = maxSpeed;
      requestAnimationFrame(giveMoment);

      return {
        isSpinning: true,
        angle: randomAngle,
        spinStartDateTime: new Date(Date.now()).getTime(),
        normalizedAngle: 0,
        spinDuration: ms
      }
    });
  }

  function addSpinDuration(ms: number) {
    update((state) => ({ ...state, spinDuration: state.spinDuration + ms }))
  }

  function stop() {
    update((state) => {
      return { ...state, isSpinning: false }
    });
  }

  return {
    subscribe,
    spin,
    addSpinDuration,
    stop
  }
}

const wheel = createWheel();

export default wheel;