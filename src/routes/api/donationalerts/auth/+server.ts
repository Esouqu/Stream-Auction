import { dev } from "$app/environment";
import { PUBLIC_DONATIONALERTS_CLIENT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const scope = 'oauth-user-show oauth-donation-subscribe';
  const redirectUrl = dev ? 'http://localhost:5173/redirect/donationalerts' : 'https://stream-auction.vercel.app/redirect/donationalerts';
  const clientId = PUBLIC_DONATIONALERTS_CLIENT_ID;
  const url = `https://www.donationalerts.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}`;

  throw redirect(302, url);
};
