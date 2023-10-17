import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

interface ICookieSession {
  accessToken: string,
  accessTokenExpiration: string,
  refreshToken: string,
  userId: string,
  socketToken: string,
}

export const GET: RequestHandler = async ({ cookies }) => {
  const redirectUrl = 'http://localhost:5173/redirect';
  const scope = 'oauth-user-show+oauth-donation-subscribe';
  const session = cookies.get('session');

  if (!session) {
    const queryParams = `client_id=${PUBLIC_DA_CLIENT_ID}&redirect_url=${redirectUrl}&response_type=code&scope=${scope}`;
    const authorizeUrl = `https://www.donationalerts.com/oauth/authorize?${queryParams}`;

    throw redirect(302, authorizeUrl);
  } else {
    const parsedSession: ICookieSession = JSON.parse(session);
    const expiration = parsedSession.accessTokenExpiration;
    const expirationTime = new Date(expiration).getTime();

    if (Date.now() < expirationTime) {
      // console.log(parsedSession.refreshToken)
      throw redirect(302, '/redirect')
    }
  }

  throw redirect(302, '/');
};

// export const POST: RequestHandler = async ({ request }) => {
//   const code = request.headers.get('code');
//   const redirectUrl = 'http://localhost:5173';
//   const tokenUrl = `https://www.donationalerts.com/oauth/token`;

//   const tokenData = await axios
//     .post<IAuthTokenData>(tokenUrl, {
//       'grant_type': 'authorization_code',
//       'client_id': PUBLIC_DA_CLIENT_ID,
//       'client_secret': DA_SECRET_KEY,
//       'code': code,
//       'redirect_url': redirectUrl,
//     })
//     .then((res) => res);

//   return json(tokenData)
// };