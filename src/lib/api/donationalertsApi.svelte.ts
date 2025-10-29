import type { IDonationAlertsUserData } from "../interfaces";

class DonationAlertsApi {
	private _user: IDonationAlertsUserData | null = $state(null);

	public clearUser() {
		this._user = null;
	}

	public setUser(user: IDonationAlertsUserData) {
		this._user = user;
	}

	public logout() {
		this.clearUser();
		fetch('/api/donationalerts/logout');
	}

	public async getUser(): Promise<IDonationAlertsUserData | null> {
		let response = await fetch('/api/donationalerts/user');

		if (response.status === 401) {
			await fetch('/api/donationalerts/refresh', { method: 'POST' });
			response = await fetch('/api/donationalerts/user');
		}

		if (response.status !== 200) return null;

		return await response.json();
	}

	public async getSocketToken(roomId: string, client: string): Promise<string | undefined> {
		try {
			return await this._fetchSocketToken(roomId, client);
		} catch (error) {
			console.error('Failed to get Centrifuge token:', error);
		}
	}

	private async _fetchSocketToken(roomId: string, client: string): Promise<string> {
		const response = await fetch('/api/donationalerts/centrifuge', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ client, channels: [roomId] })
		});

		if (!response.ok) {
			throw new Error(`Failed to get Centrifuge token: ${response.status} ${response.statusText}`);
		}

		return await response.json();
	}

	get user() { return this._user; }
}

const donationAlertsApi = new DonationAlertsApi();

export default donationAlertsApi;
