import { dev } from "$app/environment";
import { DA_SECRET_KEY } from "$env/static/private";
import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import axios from "axios";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const redirectUrl = 'http://localhost:5173/redirect/da';
  const tokenUrl = `https://www.donationalerts.com/oauth/token`;

  if (!code) throw redirect(300, '/');

  const tokenData = await axios
    .post<IAuthTokenData>(tokenUrl, {
      'grant_type': 'authorization_code',
      'client_id': PUBLIC_DA_CLIENT_ID,
      'client_secret': DA_SECRET_KEY,
      'code': code,
      'redirect_url': redirectUrl,
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
    sameSite: "lax",
    secure: !dev,
    expires: new Date(Date.now() + 30 * 1000 * 60 * 60 * 24)
  });

  throw redirect(301, '/');
};