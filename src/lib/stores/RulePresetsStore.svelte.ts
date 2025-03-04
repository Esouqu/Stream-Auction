import type { JSONContent } from "@tiptap/core";
import storable from "./LocalStore.svelte";

interface IPreset {
  id: string;
  label: string;
  content: JSONContent;
}

const initialRules: IPreset = {
  "id": "example",
  "label": "Пресет 1",
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "attrs": {
          "textAlign": null
        },
        "content": [
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              },
              {
                "type": "italic"
              },
              {
                "type": "underline"
              },
              {
                "type": "highlight",
                "attrs": {
                  "color": "#af3131"
                }
              }
            ],
            "text": "Выделите текст"
          },
          {
            "type": "text",
            "text": ", чтобы открыть меню форматирования"
          }
        ]
      }
    ]
  }
}

class RulePresets {
  private _items = storable<IPreset[]>([initialRules], 'rulesPresets');
  private _current = storable(0, 'selectedPreset');
  readonly currentItem = $derived(this.items[this.current]);

  public setLabel(id: string, label: string) {
    this._items.value = this._items.value.map((p) => {
      if (p.id === id) return { ...p, label };
      return p;
    });
  }

  public setCurrent(idx: number) {
    this._current.value = idx;
  }

  public getById(id: string) {
    return this._items.value.find((p) => p.id === id);
  }

  public remove(id: number) {
    this._items.value = this._items.value.filter((item, idx) => idx !== id);
    if (this.current >= this._items.value.length) {
      this._current.value = this._items.value.length - 1;
    }
  }

  public create() {
    const label = `Пресет ${this._items.value.length + 1}`;
    const newPreset = { id: crypto.randomUUID(), label, content: { type: 'doc', content: [] } };

    this._items.value.push(newPreset);
    this._current.value = this.items.length - 1;
  }

  get items() { return this._items.value; }
  get current() { return this._current.value; }
}

export default RulePresets;
