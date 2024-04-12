import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  let donationalertsSession = cookies.get('daSession');
  let donationalertsRefreshToken = cookies.get('daRefreshToken');

  if (!donationalertsSession && donationalertsRefreshToken) {
    const refreshTokenResponse = await fetch('/api/donationalerts/refresh', { method: 'POST' })
      .then((res) => res);

    if (refreshTokenResponse.ok) {
      const newSessionToken = await refreshTokenResponse.json()
        .then((data: IDonationAlertsRefreshToken) => data);

      donationalertsSession = newSessionToken.access_token;

      // problem with cookies still persist
      // if donationalertsSession is expires and content of the page is not changed
      // cookies is not refreshed on page reload
      // have no idea how to fix it
    } else {
      // Handle the case where refreshing the session fails
      // You can redirect to a login page or handle it based on your requirements
      // return new Response('Failed to refresh session', { status: 401 });
    }
  }

  return {
    isAuthorizedToDonationAlerts: !!donationalertsSession,
  }
};