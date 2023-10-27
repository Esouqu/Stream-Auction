import { dev } from "$app/environment";
import { TWITCH_SECRET_KEY } from "$env/static/private";
import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { IAuthTokenData, ITwitchUserData } from "$lib/interfaces";
import { redirect } from "@sveltejs/kit";
import axios from "axios";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const redirectUrl = 'https://stream-auction.vercel.app/redirect/twitch';
  // const redirectUrl = 'http://localhost:5173/redirect/twitch';
  const tokenUrl = 'https://id.twitch.tv/oauth2/token';

  if (!code) throw redirect(300, '/');

  let tokenData = await axios
    .post<IAuthTokenData>(tokenUrl, {
      grant_type: 'authorization_code',
      client_id: PUBLIC_TWITCH_CLEINT_ID,
      client_secret: TWITCH_SECRET_KEY,
      code: code,
      redirect_uri: redirectUrl,
    })
    .then((res) => res.data);

  cookies.set('twitchSession', tokenData.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: "lax",
    secure: !dev,
    expires: new Date(Date.now() + tokenData.expires_in * 1000)
  });

  cookies.set('twitchRefreshToken', tokenData.refresh_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    expires: new Date(Date.now() + 30 * 1000 * 60 * 60 * 24),
  })

  throw redirect(301, '/');
};