import { formatTime } from "$lib/utils";
import { Tween } from "svelte/motion";
import storable from "./LocalStore.svelte";

export enum TIMER_STATE {
  UNSTARTED = 'unstarted',
  STARTING = 'starting',
  PAUSED = 'paused',
  RUNNING = 'running',
  FINISHED = 'finished',
  PROCESSING_QUEUE = 'processingQueue',
}

class TimerStore {
  private _settings = storable({
    baseTime: 60000,
  }, 'timerSettings');

  private _time = new Tween(this.baseTime, { duration: 500 });
  private _state = $state(TIMER_STATE.UNSTARTED);
  private _beforeTimeUpdate = $state({ ms: 0 });
  readonly formattedTime = $derived.by(() => formatTime(this._time.current));

  private _currentTime = this.baseTime;
  private _animationId = 0;
  private _animationStartTime = 0;
  private _animationPausedTime = 0;
  private _defaultAdjustmentMs = 60000;
  private _queue: number[] = [];

  public async start(ms?: number) {
    if (this.isRunning) return;

    this._state = TIMER_STATE.STARTING;

    if (ms) await this.setTime(ms);

    this._animationStartTime = performance.now() - this._animationPausedTime;
    this._state = TIMER_STATE.RUNNING;
    this._animationId = requestAnimationFrame(this._tick.bind(this));
  }

  public pause() {
    if (this.isPaused || this.isUnstarted) return;

    cancelAnimationFrame(this._animationId);
    this._animationPausedTime = performance.now() - this._animationStartTime;
    this._state = TIMER_STATE.PAUSED;
  }

  public subtract(ms = this._defaultAdjustmentMs) {
    this._adjustTime(-ms);
  }

  public add(ms = this._defaultAdjustmentMs) {
    this._adjustTime(ms);
  }

  public async reset() {
    await this._resetTime();
    this._state = TIMER_STATE.UNSTARTED;
  }

  public async stop() {
    this._state = TIMER_STATE.FINISHED;
    await this._resetTime(0);
  }

  public async setTime(ms: number) {
    this._currentTime = ms;
    await this._time.set(ms);
  }

  public async setSeconds(seconds: number) {
    const minutes = Math.floor(this._time.target / 60000);
    const ms = this._time.target % 1000;
    await this.setTime(minutes * 60000 + seconds * 1000 + ms);
    this._saveBaseTime();
  }

  public async setMinutes(minutes: number) {
    const hours = Math.floor(this._time.target / 3600000);
    const seconds = this._time.target % 60000;
    await this.setTime((hours * 3600000) + (minutes * 60000) + seconds);
    this._saveBaseTime();
  }

  public async setHours(hours: number) {
    const currentMinutesAndSeconds = this._time.target % 3600000;
    await this.setTime((hours * 3600000) + currentMinutesAndSeconds);
    this._saveBaseTime();
  }

  public async setMilliseconds(milliseconds: number) {
    const currentHoursMinutesAndSeconds = this._time.target - (this._time.target % 1000);
    await this.setTime(currentHoursMinutesAndSeconds + milliseconds);
    this._saveBaseTime();
  }

  private _tick(frameTime: number) {
    if (this.isFinished) return;

    const remaining = this._currentTime - (frameTime - this._animationStartTime);

    if (remaining <= 0) {
      this.stop();
      return;
    }

    if (this._queue.length > 0 && this.isRunning) {
      this.pause();
      this._processQueue();
      return;
    }

    this._time.set(Math.round(remaining), { duration: 0 });
    this._animationId = requestAnimationFrame(this._tick.bind(this));
  }

  private async _adjustTime(ms: number) {
    if (this.isRunning || this.isProcessingQueue) {
      this._queue.push(ms);
      return;
    }

    this._beforeTimeUpdate = { ms };
    this._currentTime += ms;
    await this._time.set(Math.max(0, this._time.target + ms));
  }

  private async _processQueue() {
    this._state = TIMER_STATE.PROCESSING_QUEUE;

    while (this._queue.length > 0) {
      const ms = this._queue.shift() ?? 0;
      this._beforeTimeUpdate = { ms };
      this._currentTime += ms;
      await this._time.set(Math.max(0, this._time.target + ms));
    }

    this.start();
  }

  private async _resetTime(time = this.baseTime) {
    cancelAnimationFrame(this._animationId);
    this._animationPausedTime = 0;
    await this.setTime(time);
  }

  private _saveBaseTime() {
    this._settings.value.baseTime = $state.snapshot(this._time.target);
  }

  get target() { return this._time.target; }
  get current() { return this._time.current; }
  get baseTime() { return this._settings.value.baseTime; }
  get beforeTimeUpdate() { return this._beforeTimeUpdate; }
  get state() { return this._state; }
  get isUnstarted() { return this._state === TIMER_STATE.UNSTARTED; }
  get isStarting() { return this._state === TIMER_STATE.STARTING; }
  get isRunning() { return this._state === TIMER_STATE.RUNNING; }
  get isPaused() { return this._state === TIMER_STATE.PAUSED; }
  get isFinished() { return this._state === TIMER_STATE.FINISHED; }
  get isProcessingQueue() { return this._state === TIMER_STATE.PROCESSING_QUEUE; }
  get isActive() { return this.isStarting || this.isRunning || this.isProcessingQueue; }
};

export default TimerStore;
