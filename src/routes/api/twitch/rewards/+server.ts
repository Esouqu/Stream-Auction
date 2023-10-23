import { PUBLIC_TWITCH_CLEINT_ID } from "$env/static/public";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const POST: RequestHandler = async ({ request, url }) => {
  const authHeader = request.headers.get('authorization');
  const broadcasterId = url.searchParams.get('broadcaster_id');
  // const rewardsUrl = `http://localhost:8080/mock/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`;
  const rewardsUrl = `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${broadcasterId}`;


  const reward = await axios.post(rewardsUrl, {
    title: 'Stream Auction - Бесплатный Заказ',
    cost: 10,
  }, {
    headers: {
      'Authorization': authHeader,
      'client-id': PUBLIC_TWITCH_CLEINT_ID,
      "Content-Type": 'application/json',
    }
  }).then((res) => res.data);

  // console.log(reward.request)
  return new Response(JSON.stringify(reward), { status: 200 });
};