import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { ITwitchUserData } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ fetch }) => {
  const session = await fetch('/api/twitch/session').then((res) => res.json()).then((data) => data);

  // const token = await axios.post('http://localhost:8080/auth/authorize?client_id=a79005ffe352c0d0c7c579c3f2cdc8&client_secret=1f32e0339a25c0ff5de8659a37b3e8&grant_type=user_token&user_id=53746323&scope=channel:manage:redemptions+channel:read:redemptions').then((res) => res).then((data) => data.data.access_token);

  // console.log(token);

  // const user = await axios.get<{ data: ITwitchUserData[] }>('http://localhost:8080/mock/users', {
  //   headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': 'a79005ffe352c0d0c7c579c3f2cdc8' }
  // }).then((res) => res.data.data);

  const user = await axios.get<{ data: ITwitchUserData[] }>('https://api.twitch.tv/helix/users', {
    headers: { 'Authorization': `Bearer ${session}`, 'Client-Id': PUBLIC_TWITCH_CLEINT_ID }
  }).then((res) => res.data.data);

  // console.log(user)

  return new Response(JSON.stringify(user[0].id), { status: 200 });
};