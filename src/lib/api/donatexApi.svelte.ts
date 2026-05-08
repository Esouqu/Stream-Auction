class DonatexApi {
	private _isLoggedIn = $state(false);

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	public async getToken(): Promise<string | null> {
		let res = await fetch('/api/donatex/token');

		if (res.status === 401) {
			const refreshRes = await fetch('/api/donatex/refresh', { method: 'POST' });

			if (refreshRes.ok) {
				res = await fetch('/api/donatex/token');
			} else {
				// Refresh failed (user truly logged out)
				this._isLoggedIn = false;
				return null;
			}
		}

		if (!res.ok) {
			this._isLoggedIn = false;
			return null;
		}

		const { token } = await res.json();

		if (token) {
			this._isLoggedIn = true;
			return token;
		}

		this._isLoggedIn = false;
		return null;
	}

	public logout() {
		fetch('/api/donatex/logout');
	}
}

const donatexApi = new DonatexApi();
export default donatexApi;