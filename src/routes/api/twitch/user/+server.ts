import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { ITwitchUserData } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ fetch }) => {
  const session = await fetch('/api/twitch/session').then((res) => res.json()).then((data) => data);

  const user = await axios.get<{ data: ITwitchUserData[] }>('https://api.twitch.tv/helix/users', {
    headers: { 'Authorization': `Bearer ${session}`, 'Client-Id': PUBLIC_TWITCH_CLEINT_ID }
  }).then((res) => res.data.data);

  return new Response(JSON.stringify(user[0].id), { status: 200 });
};