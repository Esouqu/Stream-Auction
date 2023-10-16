import { dev } from "$app/environment";
import { DA_SECRET_KEY } from "$env/static/private";
import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import axios from "axios";

interface IUserData {
  data: {
    id: number,
    code: string,
    name: string,
    is_active: number,
    avatar: string,
    email: string | null,
    language: string,
    socket_connection_token: string
  }
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  // const session = cookies.get('session');
  const code = url.searchParams.get('code');
  const redirectUrl = 'http://localhost:5173';
  const tokenUrl = `https://www.donationalerts.com/oauth/token`;

  if (!code) return;

  const tokenData = await axios
    .post<IAuthTokenData>(tokenUrl, {
      'grant_type': 'authorization_code',
      'client_id': PUBLIC_DA_CLIENT_ID,
      'client_secret': DA_SECRET_KEY,
      'code': code,
      'redirect_url': redirectUrl,
    })
    .then((res) => res.data);

  // const refreshTokenData = await axios
  // .post<IAuthTokenData>(tokenUrl, {
  //   grant_type: 'refresh_token',
  //   refresh_token: parsedSession.refreshToken,
  //   client_id: PUBLIC_DA_CLIENT_ID,
  //   client_secret: DA_SECRET_KEY,
  //   scope,
  // }).then((res) => res.data);

  const user = await axios.get<IUserData>('https://www.donationalerts.com/api/v1/user/oauth', {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
  }).then((res) => res.data.data);

  cookies.set('session', JSON.stringify({
    accessToken: tokenData.access_token,
    accessTokenExpiration: new Date(Date.now() + tokenData.expires_in),
    refreshToken: tokenData.refresh_token,
    userId: user.id,
    socketToken: user.socket_connection_token,
  }), {
    path: '/',
    httpOnly: true,
    sameSite: "lax",
    secure: !dev,
    expires: new Date(Date.now() + tokenData.expires_in)
  });

  throw redirect(301, '/');
};