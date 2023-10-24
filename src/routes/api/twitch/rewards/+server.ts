import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const POST: RequestHandler = async ({ request, url }) => {
  const authHeader = request.headers.get('authorization');
  const broadcasterId = url.searchParams.get('broadcaster_id');
  const rewardsUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`;
  // const rewardsUrl = `http://localhost:8080/mock/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`;

  const reward = await axios.post(rewardsUrl, {
    title: 'Stream Auction - Бесплатный Заказ',
    cost: 10,
    is_user_input_required: true
  }, {
    headers: {
      'Authorization': authHeader,
      // 'client-id': 'a79005ffe352c0d0c7c579c3f2cdc8',
      'client-id': PUBLIC_TWITCH_CLEINT_ID,
      "Content-Type": 'application/json',
    }
  }).then((res) => res.data);

  return new Response(JSON.stringify(reward), { status: 200 });
};