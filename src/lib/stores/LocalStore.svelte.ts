import { browser } from '$app/environment';

export class LocalStore<T> {
  public value = $state<T>() as T;
  private _key = '';

  constructor(value: T, key: string) {
    this._key = key;
    this.value = value;

    if (browser) {
      this._initializeValue();

      $effect.root(() => {
        $effect(() => {
          this._updateLocalStorage();
        });
      });
    }
  }

  private _initializeValue() {
    // modifying deeply nested objects will result in error
    // where the modified field is undefined.
    // so make it flat to avoid this error
    const item = localStorage.getItem(this._key);

    if (item) {
      const deserializedValue = this._deserialize(item);

      if (deserializedValue) {
        if (Array.isArray(deserializedValue)) {
          this.value = [...deserializedValue] as T;
        } else if (typeof deserializedValue === 'object') {
          // make sure that the stored value is not missing any properties
          this.value = { ...this.value, ...deserializedValue };
        } else {
          this.value = deserializedValue as T;
        }
      }
    } else {
      localStorage.setItem(this._key, this._serialize(this.value));
    }
  }

  private _updateLocalStorage() {
    const currentSerializedValue = this._serialize(this.value);
    const existingItem = localStorage.getItem(this._key);

    if (existingItem !== currentSerializedValue) {
      localStorage.setItem(this._key, currentSerializedValue);
    }
  }

  private _serialize(value: T): string {
    return JSON.stringify(value);
  }

  private _deserialize(item: string): T | undefined {
    try {
      return JSON.parse(item);
    } catch {
      return undefined;
    }
  }
}

export default function storable<T>(value: T, key: string) {
  return new LocalStore(value, key);
}