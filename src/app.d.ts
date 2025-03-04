import type { ILot } from "$lib/interfaces";
import type { IDonation } from "$lib/stores/DonationStore.svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface CustomEventMap {
		"__newLot": CustomEvent<ILot>;
		"__newLeader": CustomEvent<ILot>;
		"__newDonation": CustomEvent<IDonation>;
	}
	interface Window {
		addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Window, ev: CustomEventMap[K]) => void): void;
		removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Window, ev: CustomEventMap[K]) => void): void;
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
	}
}

export { };