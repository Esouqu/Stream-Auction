import type { IDonationAlertsUserData } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ fetch }) => {
  const session = await fetch('/api/da/session').then((res) => res.json()).then((data) => data);

  const user = await axios.get<{ data: IDonationAlertsUserData }>('https://www.donationalerts.com/api/v1/user/oauth', {
    headers: { 'Authorization': `Bearer ${session}` }
  }).then((res) => res.data.data);

  return new Response(JSON.stringify(user), { status: 200 });
};