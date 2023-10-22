import { dev } from "$app/environment";
import { TWITCH_SECRET_KEY } from "$env/static/private";
import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get('twitchRefreshToken');

  if (!refreshToken) throw redirect(301, '/');

  const tokenData = await axios
    .post<IAuthTokenData>('https://id.twitch.tv/oauth2/token', {
      grant_type: 'refresh_token',
      client_id: PUBLIC_TWITCH_CLEINT_ID,
      client_secret: TWITCH_SECRET_KEY,
      refresh_token: refreshToken
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

  return new Response(JSON.stringify(tokenData), { status: 200 });
};