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

  get user() { return this._user; }
}

const donationAlertsApi = new DonationAlertsApi();

export default donationAlertsApi;
