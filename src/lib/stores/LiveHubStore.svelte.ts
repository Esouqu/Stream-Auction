import storable from "./LocalStore.svelte";
import type {IAuthTokenData} from "$lib/interfaces";


class LiveHubData {
    private _oidcData = storable<IAuthTokenData | null>(null, 'livehub:oidc');

    public setTokenData(data: IAuthTokenData) {
        this._oidcData.value = data;
    }

    public clean() {
        this._oidcData.value = null;
    }
}
export default LiveHubData;
