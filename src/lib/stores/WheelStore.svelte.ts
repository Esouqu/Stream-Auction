import { patterns } from "$lib/constants";
import storable from "./LocalStore.svelte";

export enum WHEEL_STATE {
  IDLE = 'idle',
  PREPARING = 'preparing',
  SPINNING = 'spinning',
  DELAYED = 'delayed',
  FINISHED = 'finished',
}

class WheelStore {
  private _settings = storable({
    durationRange: [20, 100],
    patternId: 1,
  }, 'wheelSettings');

  private _state = $state(WHEEL_STATE.IDLE);
  private _spinDuration = $state(20);
  private _speed = $state(0);
  private _rotation = $state(0);
  private _normalizedRotation = $derived.by(() => {
    const angleModulo = Math.abs(this._rotation % 360);
    const isClockwiseRotation = this._rotation > 0;

    return isClockwiseRotation ? 360 - angleModulo : angleModulo;
  });
  readonly pattern = $derived(patterns[this.settings.patternId])

  private _accelerationTime = 0.1;
  private _decelerationTime = 0.3;
  private _slowDownTime = 0.6;
  private _generalTime = this._accelerationTime + this._slowDownTime;
  private _startAngle = 0;
  private _endAngle = 0;
  private _maxSpeed = 5;
  private _startTime = 0;
  private _animationId = 0;

  public stop(isManual = false) {
    cancelAnimationFrame(this._animationId);
    if (isManual) {
      this._state = WHEEL_STATE.IDLE
    } else {
      this._state = WHEEL_STATE.FINISHED;
    }
  }

  public extendSpin(sec: number) {
    this._spinDuration += sec;
  }

  public async spin() {
    this._state = WHEEL_STATE.PREPARING;
    this._startTime = performance.now();
    this._rotation = -this._normalizedRotation;
    this._startAngle = this._rotation;
    this._endAngle = this._startAngle - Math.floor(Math.random() * 360);

    requestAnimationFrame(this._animate.bind(this));
  }

  private _prepareAnimation(time: number) {
    const duration = 500;
    const progress = (time - this._startTime) / duration;
    const easedProgress = progress < 0.5
      ? 2 * Math.pow(progress, 2)
      : 1 - 2 * Math.pow(1 - progress, 2);

    this._rotation = this._startAngle + (this._endAngle - this._startAngle) * easedProgress;
    this._animationId = requestAnimationFrame(this._animate.bind(this));

    if (progress >= 1) {
      this._state = WHEEL_STATE.SPINNING;
      this._startTime = performance.now();
    }
  }

  private _mainAnimation(time: number) {
    const elapsedTime = (time - this._startTime) / 1000;
    const progress = elapsedTime / this._spinDuration;

    if (progress < 1) {
      this._speed = this._calculateSpeed(progress, elapsedTime);
      this._rotation += this._speed;
      this._animationId = requestAnimationFrame(this._animate.bind(this));
    } else {
      this._state = WHEEL_STATE.DELAYED;
    }
  }

  private _animate(time: number) {
    if (this.isPreparing) {
      this._prepareAnimation(time);
    } else {
      this._mainAnimation(time);
    }
  }

  private _calculateSpeed(progress: number, elapsedTime: number) {
    // return this._maxSpeed * Math.sin((progress + 1) * Math.PI / 2)
    if (progress <= this._accelerationTime) {
      return this._maxSpeed * (progress / this._accelerationTime);
    } else if (progress > this._accelerationTime && progress <= this._generalTime) {
      const slowdownProgress = (progress - this._accelerationTime) / this._slowDownTime;
      return this._maxSpeed - slowdownProgress * (this._maxSpeed - 1);
    } else {
      const slowdownProgress =
        (elapsedTime - this._spinDuration * this._generalTime) / (this._spinDuration * this._decelerationTime);
      return 1 * (1 - slowdownProgress);
    }
  }

  get rotation() { return this._rotation; }
  set rotation(angle: number) { this._rotation = angle; }

  get spinDuration() { return this._spinDuration; }
  set spinDuration(ms: number) { this._spinDuration = ms; }

  get speed() { return this._speed; }
  get maxSpeed() { return this._maxSpeed; }
  get normalizedRotation() { return this._normalizedRotation; }
  get state() { return this._state; }
  get isIdle() { return this._state === WHEEL_STATE.IDLE; }
  get isPreparing() { return this._state === WHEEL_STATE.PREPARING; }
  get isSpinning() { return this._state === WHEEL_STATE.SPINNING; }
  get isDelayed() { return this._state === WHEEL_STATE.DELAYED; }
  get isFinished() { return this._state === WHEEL_STATE.FINISHED; }
  get isActive() { return this.isPreparing || this.isSpinning || this.isDelayed }
  get settings() { return this._settings.value; }
}

export default WheelStore;

