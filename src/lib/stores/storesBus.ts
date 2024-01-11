import donations from "./donations";
import lots from "./lots";
import timer from "./timer";
import wheel from "./wheel";

const stores = [lots, donations, wheel, timer];

function subscribeStores() {
  for (let i = 0; i < stores.length; i++) {
    stores[i].init();
  }
}

export default subscribeStores;