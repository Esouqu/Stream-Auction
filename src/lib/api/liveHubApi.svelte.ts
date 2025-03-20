import type { ILiveHubUserData } from "../interfaces";

class LiveHubApi {
    private _user: ILiveHubUserData | null = $state(null);

    public clearUser() {
        this._user = null;
    }

    public setUser(user: ILiveHubUserData) {
        this._user = user;
    }

    public logout() {
        this.clearUser();
        fetch('/api/livehub/logout');
    }

    public async getUser(): Promise<ILiveHubUserData | null> {
        let response = await fetch('/api/livehub/user');

        if (response.status === 401) {
            await fetch('/api/livehub/refresh', { method: 'POST' });
            response = await fetch('/api/livehub/user');
        }

        if (response.status !== 200) return null;

        return await response.json();
    }

    get user() { return this._user; }
}

const liveHubApi = new LiveHubApi();

export default liveHubApi;
