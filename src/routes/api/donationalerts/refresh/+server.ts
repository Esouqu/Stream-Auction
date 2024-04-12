import { dev } from "$app/environment";
import { DA_SECRET_KEY } from "$env/static/private";
import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, setHeaders }) => {
  const refreshToken = cookies.get('daRefreshToken');
  const scope = 'oauth-user-show oauth-donation-subscribe';

  if (!refreshToken) return new Response('No refresh token is available', { status: 400 });

  try {
    const response = await fetch('https://www.donationalerts.com/oauth/token', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: PUBLIC_DA_CLIENT_ID,
        client_secret: DA_SECRET_KEY,
        refresh_token: refreshToken,
        scope,
      })
    }).then((res) => res);

    console.log(response);
    const tokenData = await response.json().then((data: IDonationAlertsRefreshToken) => data);

    console.log(tokenData);
    cookies.set('daSession', tokenData.access_token, {
      path: '/',
      secure: !dev,
      expires: new Date(Date.now() + tokenData.expires_in)
    });

    if (tokenData.refresh_token) {
      cookies.set('daRefreshToken', tokenData.refresh_token, {
        path: '/',
        secure: !dev,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
    }

    return new Response(JSON.stringify(tokenData), { status: 200 });
  } catch (err: unknown) {
    const error = err as { response: { status: number } };

    if (error.response?.status === 401) {
      return new Response('The donation alerts refresh token is invalid', { status: 401 });
    } else {
      return new Response('Something went wrong', { status: 500 });
    }
  }
};