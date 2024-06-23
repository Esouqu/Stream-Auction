import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
import type { LayoutServerLoad } from "./$types";
import { v4 as uuidv4 } from 'uuid';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const lastVisit = cookies.get('lastVisit');
  let donationalertsSession = cookies.get('daSession');
  let donationalertsRefreshToken = cookies.get('daRefreshToken');

  cookies.set('lastVisit', new Date().toString(), { path: '/' });

  if (!donationalertsSession && donationalertsRefreshToken) {
    const refreshTokenResponse = await fetch('/api/donationalerts/refresh', { method: 'POST' })
      .then((res) => res);

    if (refreshTokenResponse.ok) {
      const newSessionToken = await refreshTokenResponse.json()
        .then((data: IDonationAlertsRefreshToken) => data);

      donationalertsSession = newSessionToken.access_token;

      // problem with cookies still persist
      // if return of that function is the same as previous, then
      // cookies is not refreshed on page reload

      // workaround is assigning randomId that will ensure that returned content wiil be always different
      // TODO change isAuthorizedToDonationAlerts to something more dynamic
    } else {
      // Handle the case where refreshing the session fails
      // You can redirect to a login page or handle it based on your requirements
      // return new Response('Failed to refresh session', { status: 401 });
    }
  }

  return {
    isAuthorizedToDonationAlerts: !!donationalertsSession,
    lastVisit: lastVisit ? new Date(lastVisit) : undefined,
    randomId: uuidv4(),
  }
};