import { dev } from "$app/environment";
import { DA_SECRET_KEY } from "$env/static/private";
import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get('daRefreshToken');

  if (!refreshToken) throw redirect(301, '/');

  const tokenData = await axios
    .post<IAuthTokenData>('https://www.donationalerts.com/oauth/token', {
      grant_type: 'refresh_token',
      client_id: PUBLIC_DA_CLIENT_ID,
      client_secret: DA_SECRET_KEY,
      refresh_token: refreshToken
    })
    .then((res) => res.data);

  cookies.set('daSession', tokenData.access_token, {
    path: '/',
    httpOnly: true,
    sameSite: "lax",
    secure: !dev,
    expires: new Date(Date.now() + tokenData.expires_in)
  });
  cookies.set('daRefreshToken', tokenData.refresh_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    expires: new Date(Date.now() + 30 * 1000 * 60 * 60 * 24),
  })

  return new Response(JSON.stringify(tokenData), { status: 200 });
};