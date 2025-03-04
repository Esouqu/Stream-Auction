import type { IDonatePayUserData } from "$lib/interfaces";
import storable from "$lib/stores/LocalStore.svelte";

interface DonatePayUser {
  id: number;
  username: string;
}

class DonatePayApi {
  private _user = storable<DonatePayUser | null>(null, 'donatePayUser');

  public clearUser() {
    this._user.value = null;
  }

  public setUser(user: DonatePayUser) {
    this._user.value = user;
  }

  public logout() {
    fetch('/api/donatepay/key', { method: 'DELETE' });
  }

  public async getToken() {
    const response = await fetch('/api/donatepay/token');

    if (response.ok) {
      return await response.json() as { token: string, apiKey: string };
    }
  };

  public async getApiKey() {
    const response = await fetch('/api/donatepay/key');

    if (response.ok) {
      return await response.json() as string;
    }
  }

  public setApiKey(token: string) {
    fetch('/api/donatepay/key', {
      method: 'POST',
      body: JSON.stringify({ access_token: token })
    })
  }

  public async getUser(accessToken = '') {
    const response = await fetch(`/api/donatepay/user?access_token=${accessToken}`);

    if (response.ok) {
      return (await response.json()) as { data: IDonatePayUserData };
    }
  }

  get user() { return this._user.value; }
}

const donatePayApi = new DonatePayApi();

export default donatePayApi;