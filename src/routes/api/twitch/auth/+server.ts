import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const twitchScope = 'channel:manage:redemptions+channel:read:redemptions';
  const twitchRedirectUrl = 'http://localhost:5173/redirect/twitch';
  // const twitchRedirectUrl = 'https://stream-auction.vercel.app/redirect/twitch';
  const queryParams = `response_type=code&client_id=${PUBLIC_TWITCH_CLEINT_ID}&redirect_uri=${twitchRedirectUrl}&scope=${twitchScope}`;
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?${queryParams}`;

  throw redirect(302, twitchAuthUrl);
};