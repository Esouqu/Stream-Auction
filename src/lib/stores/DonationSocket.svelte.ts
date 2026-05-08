import { SOCKET_STATE, type DonationSource, type IDonationSocketData } from "$lib/interfaces";
import { SvelteSet } from "svelte/reactivity";

type DonationHandler = (donation: IDonationSocketData) => void;

abstract class DonationSocket {
	protected _state = $state(SOCKET_STATE.CLOSED);
	protected _donationListeners = new SvelteSet<DonationHandler>();

	readonly id: DonationSource;
	readonly color: string;

	get state() {
		return this._state;
	}

	get isOpen() {
		return this._state === SOCKET_STATE.OPEN;
	}

	get isConnecting() {
		return this._state === SOCKET_STATE.CONNECTING;
	}

	get isClosed() {
		return this._state === SOCKET_STATE.CLOSED;
	}

	constructor(id: DonationSource, color: string) {
		this.id = id;
		this.color = color;
	}

	public onDonation(handler: DonationHandler) {
		this._donationListeners.add(handler);
		return () => this._donationListeners.delete(handler);
	}

	public abstract connect(): Promise<void>;
	public abstract disconnect(): void;
}

export default DonationSocket;
