import type { DonationSource } from "$lib/interfaces";

export interface IDonation {
	id: string;
	username: string;
	amount: number;
	message: string;
	source: DonationSource;
	isInstant: boolean;
}

class DonationStore {
	private _items: IDonation[] = $state([]);

	public add(donation: IDonation) {
		this._items.push(donation);

		if (donation.isInstant) {
			setTimeout(() => this.remove(donation.id), 7000);
		}

		dispatchEvent(new CustomEvent('__newDonation', { detail: donation }));
	}

	public remove(id: number | string) {
		this._items = this._items.filter((d) => d.id !== id);
	}

	public clear() {
		this._items = [];
	}

	get items() { return this._items; }
}

export default DonationStore;
