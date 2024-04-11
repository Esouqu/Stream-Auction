import { dev } from "$app/environment";
import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch, locals }) => {
  let donationalertsSession = cookies.get('daSession');
  let donationalertsRefreshToken = cookies.get('daRefreshToken');

  if (!donationalertsSession && donationalertsRefreshToken) {
    const refreshTokenResponse = await fetch('/api/donationalerts/refresh', { method: 'POST' })
      .then((res) => res);

    if (refreshTokenResponse.ok) {
      const newSessionToken = await refreshTokenResponse.json()
        .then((data: IDonationAlertsRefreshToken) => data);

      donationalertsSession = newSessionToken.access_token;
      cookies.set('daSession', newSessionToken.access_token, {
        path: '/',
        secure: !dev,
        expires: new Date(Date.now() + newSessionToken.expires_in)
      });

      if (newSessionToken.refresh_token) {
        cookies.set('daRefreshToken', newSessionToken.refresh_token, {
          path: '/',
          secure: !dev,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });
      }
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