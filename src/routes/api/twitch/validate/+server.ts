import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get('twitchSession');

  if (!session) return new Response('No twitch session available', { status: 401 });

  const validatedToken = await axios.get('https://id.twitch.tv/oauth2/validate', {
    headers: { 'Authorization': `Bearer ${session}` }
  }).then((res) => res);

  return new Response(JSON.stringify(validatedToken.data), { status: 200 });
};