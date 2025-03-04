import { dev } from "$app/environment";
import { DONATIONALERTS_REFRESH_TOKEN_COOKIE, DONATIONALERTS_SECRET_KEY, DONATIONALERTS_TOKEN_COOKIE } from "$env/static/private";
import { PUBLIC_DONATIONALERTS_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, fetch }) => {
  const refreshToken = cookies.get(DONATIONALERTS_REFRESH_TOKEN_COOKIE);
  const scope = 'oauth-user-show oauth-donation-subscribe';

  if (!refreshToken) return new Response('No refresh token is available', { status: 400 });

  try {
    const response = await fetch('https://www.donationalerts.com/oauth/token', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: PUBLIC_DONATIONALERTS_CLIENT_ID,
        client_secret: DONATIONALERTS_SECRET_KEY,
        refresh_token: refreshToken,
        scope,
      })
    });

    if (response.status === 401) {
      cookies.delete(DONATIONALERTS_REFRESH_TOKEN_COOKIE, { path: '/' });
      return new Response('The donation alerts refresh token is invalid', { status: 401 });
    }

    const tokenData = await response.json().then((data: IAuthTokenData) => data);

    cookies.set(DONATIONALERTS_TOKEN_COOKIE, tokenData.access_token, {
      path: '/',
      secure: !dev,
      expires: new Date(Date.now() + tokenData.expires_in)
    });

    if (tokenData.refresh_token) {
      cookies.set(DONATIONALERTS_REFRESH_TOKEN_COOKIE, tokenData.refresh_token, {
        path: '/',
        secure: !dev,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
    }

    return new Response(JSON.stringify(tokenData), { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error refreshing DonationAlerts token:', err);
    } else {
      console.error('Unknown error refreshing DonationAlerts token:', err);
    }

    return new Response('Something went wrong', { status: 500 });
  }
};