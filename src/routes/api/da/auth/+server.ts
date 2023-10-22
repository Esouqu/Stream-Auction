import { PUBLIC_DA_CLIENT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const daScope = 'oauth-user-show+oauth-donation-subscribe';
  const redirectUrl = 'http://localhost:5173/redirect/da';
  const daQueryParams = `client_id=${PUBLIC_DA_CLIENT_ID}&redirect_url=${redirectUrl}&response_type=code&scope=${daScope}`;
  const daAuthUrl = `https://www.donationalerts.com/oauth/authorize?${daQueryParams}`;

  throw redirect(302, daAuthUrl);
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