import { dev } from "$app/environment";
import { TWITCH_SECRET_KEY } from "$env/static/private";
import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import axios, { AxiosError } from "axios";

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get('twitchRefreshToken');

  if (!refreshToken) throw redirect(301, '/');

  try {
    const response = await axios
      .post<IAuthTokenData>('https://id.twitch.tv/oauth2/token', {
        grant_type: 'refresh_token',
        client_id: PUBLIC_TWITCH_CLEINT_ID,
        client_secret: TWITCH_SECRET_KEY,
        refresh_token: refreshToken
      });

    cookies.set('twitchSession', response.data.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: "lax",
      secure: !dev,
      expires: new Date(Date.now() + response.data.expires_in * 1000)
    });
    cookies.set('twitchRefreshToken', response.data.refresh_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !dev,
      expires: new Date(Date.now() + 30 * 1000 * 60 * 60 * 24),
    })

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (err) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      return new Response('The twitch refresh token is invalid', { status: 401 });
    } else {
      return new Response('Something went wrong', { status: 500 });
    }
  }
};