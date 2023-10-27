import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { ITwitchUserData } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get('twitchSession');

  if (!session) return new Response('No twitch session available', { status: 401 });

  const user = await axios.get<{ data: ITwitchUserData[] }>('https://api.twitch.tv/helix/users', {
    headers: { 'Authorization': `Bearer ${session}`, 'Client-Id': PUBLIC_TWITCH_CLEINT_ID }
  }).then((res) => res.data.data);

  return new Response(JSON.stringify(user[0].id), { status: 200 });
};