import { writable } from 'svelte/store';
import confetti from 'canvas-confetti';

function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.75 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      shapes: ['circle'],
      scalar: 2 / 2
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  });
  fire(0.2, {
    spread: 60
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}

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
  const accelerationTime = 0.1;
  const decelerationTime = 0.3;
  const slowDownTime = 0.6;
  const generalTime = accelerationTime + slowDownTime;

  let speed = 0;
  let animationId: number;
  let spinStartTime: number;

  function giveMoment(currentTime: number) {
    if (!spinStartTime) spinStartTime = currentTime;

    update((state) => {
      if (!state.isSpinning) {
        spinStartTime = 0;
        fireConfetti();

        return { ...state, isSpinning: false };
      }

      const elapsedTime = currentTime - spinStartTime;
      const progress = Math.min(elapsedTime / state.spinDuration, 1);

      if (progress >= 1) {
        spinStartTime = 0;
        fireConfetti();

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

  function setAngle(deg: number) {
    update((state) => ({ ...state, angle: deg }));
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
    stop,
    setAngle
  }
}

const wheel = createWheel();

export default wheel;