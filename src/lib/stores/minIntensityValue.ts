import storable from "./storable";

function createMinIntensityValue() {
  const { subscribe, set } = storable({
    price: 1000,
    isEnabled: true,
  }, 'intensitySetting');

  return {
    subscribe,
    set
  }
}

const minIntensityValue = createMinIntensityValue();

export default minIntensityValue;