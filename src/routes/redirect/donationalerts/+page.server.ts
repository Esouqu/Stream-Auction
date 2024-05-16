import { dev } from "$app/environment";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import { DA_SECRET_KEY } from "$env/static/private";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const redirectUrl = dev ? 'http://localhost:5173/redirect/donationalerts' : 'https://stream-auction.vercel.app/redirect/donationalerts';
  const tokenUrl = 'https://www.donationalerts.com/oauth/token';

  if (!code) throw redirect(300, '/integrations');

  const tokenData = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      'grant_type': 'authorization_code',
      'client_id': PUBLIC_DA_CLIENT_ID,
      'client_secret': DA_SECRET_KEY,
      'code': code,
      'redirect_uri': redirectUrl,
    })
  }).then((res) => res.json()).then((data: IAuthTokenData) => data);

  cookies.set('daSession', tokenData.access_token, {
    path: '/',
    secure: !dev,
    expires: new Date(Date.now() + tokenData.expires_in)
  });
  cookies.set('daRefreshToken', tokenData.refresh_token, {
    path: '/',
    secure: !dev,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  });

  throw redirect(301, '/settings');
};