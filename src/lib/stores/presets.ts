import type { IPreset } from '$lib/interfaces';
import storable from './storable';

const initialPresets: IPreset[] = [
  { title: 'Правила', text: '' }
]

function createPresets() {
  const { subscribe, set, update } = storable<IPreset[]>(initialPresets, 'presets');

  function remove(index: number) {
    update((items) => items.filter((_, idx) => idx !== index));
  }

  function create() {
    update((items) => [...items, { title: '', text: '' }]);
  }

  return {
    subscribe,
    set,
    remove,
    create,
  }
}

const presets = createPresets();

export default presets;