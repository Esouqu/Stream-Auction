import storable from "./storable";

function createMinIntensityValue() {
  const { subscribe, set } = storable(1000, 'minIntensityValue');

  return {
    subscribe,
    set
  }
}

const minIntensityValue = createMinIntensityValue();

export default minIntensityValue;