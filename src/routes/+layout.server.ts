import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch, setHeaders }) => {
  let donationalertsSession = cookies.get('daSession');

  if (!donationalertsSession) {
    const refreshTokenResponse = await fetch('/api/donationalerts/refresh', { method: 'POST' })
      .then((res) => res);

    if (refreshTokenResponse.status === 200) {
      donationalertsSession = await refreshTokenResponse.json().then((data: IDonationAlertsRefreshToken) => data.access_token);
    }
  }

  // setHeaders({ 'cache-control': 'no-store' });

  return {
    isAuthorizedToDonationAlerts: !!donationalertsSession,
  }
};