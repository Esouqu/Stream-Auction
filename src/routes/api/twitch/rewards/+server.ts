import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { RequestHandler } from "@sveltejs/kit";
import axios, { AxiosError } from "axios";

export const GET: RequestHandler = async ({ cookies, url }) => {
  const session = cookies.get('twitchSession');
  const broadcasterId = url.searchParams.get('broadcaster_id');
  const rewardsUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}&only_manageable_rewards=true`;

  if (!session) return new Response('No twitch session available', { status: 401 });

  const reward = await axios.get(rewardsUrl, {
    headers: {
      'Authorization': `Bearer ${session}`,
      'client-id': PUBLIC_TWITCH_CLEINT_ID,
      "Content-Type": 'application/json',
    }
  }).then((res) => res.data);

  return new Response(JSON.stringify(reward), { status: 200 });
};

export const POST: RequestHandler = async ({ cookies, url }) => {
  const session = cookies.get('twitchSession');
  const broadcasterId = url.searchParams.get('broadcaster_id');
  const rewardsUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`;

  let reward;

  if (!session) return new Response('No twitch session available', { status: 401 });

  const response = await axios.post(rewardsUrl, {
    title: 'Stream Auction - Бесплатный Заказ',
    cost: 10,
    is_user_input_required: true,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 120,
  }, {
    headers: {
      'Authorization': `Bearer ${session}`,
      'client-id': PUBLIC_TWITCH_CLEINT_ID,
      'Content-Type': 'application/json',
    }
  });

  if (response.status === 200) {
    reward = response.data;
    return new Response(JSON.stringify(reward), { status: 200 });
  } else if (response.status === 400) {
    return new Response(JSON.stringify('Duplicate Reward'), { status: response.data.status });
  } else {
    return new Response(JSON.stringify('Something went wrong'), { status: response.data.status });
  }
};