import storable from "./LocalStore.svelte";

interface BackgroundSettings {
  url: string | null;
  dimness: number;
  blur: number;
  isFlameEnabled: boolean;
  flameSizeTickSec: number;
  flameSize1Price: number;
  flameSize2Price: number;
  flameSize3Price: number;
  flameSize4Price: number;
}

class BackgroundStore {
  private _settings = storable<BackgroundSettings>({
    url: null,
    dimness: 70,
    blur: 0,
    isFlameEnabled: false,
    flameSizeTickSec: 15,
    flameSize1Price: 150,
    flameSize2Price: 300,
    flameSize3Price: 500,
    flameSize4Price: 1000,
  }, 'backgroundSettings');
  readonly type = $derived.by(() => this.getType.bind(this)(this.url));
  readonly floatDimness = $derived((this.dimness / 100).toFixed(1));

  private _currentFlameSize = $state(0);
  private _maxFlameSize = 4;
  private _intervalId: NodeJS.Timeout | undefined;

  public increaseFlameSize(amount = 1) {
    this._currentFlameSize = Math.min(this._currentFlameSize + amount, this._maxFlameSize);
    this._decreaseFlameSizeWithInterval();
  }

  public decreaseFlameSize(amount = 1) {
    this._currentFlameSize = Math.max(this._currentFlameSize - amount, 0);
  }

  private _decreaseFlameSizeWithInterval() {
    clearInterval(this._intervalId);

    this._intervalId = setInterval(() => {
      if (this._currentFlameSize < 1) clearInterval(this._intervalId);

      this.decreaseFlameSize();
    }, this.settings.flameSizeTickSec * 1000);
  }

  public clearBackground() {
    this.settings.url = null;
  }

  public setBackground(url: string) {
    this.settings.url = url;
  }

  public getType(url: string | null) {
    if (!url) return null;

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'flv'];

    const extension = url.split('.').pop()?.toLowerCase();

    if (extension && imageExtensions.includes(extension)) {
      return 'image';
    } else if (extension && videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return null;
    }
  }

  get settings() { return this._settings.value; }
  get url() { return this.settings.url; }
  get dimness() { return this.settings.dimness; }
  get blur() { return this.settings.blur; }
  get currentFlameSize() { return this._currentFlameSize; }
}

export default BackgroundStore;
