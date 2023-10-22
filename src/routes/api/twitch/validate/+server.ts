import { redirect, type RequestHandler } from "@sveltejs/kit";
import axios from "axios";

export const GET: RequestHandler = async ({ fetch }) => {
  const session = await fetch('/api/twitch/session').then((res) => res.json());

  if (!session) throw redirect(302, '/');

  const isValid = await axios.get('https://id.twitch.tv/oauth2/validate', {
    headers: { 'Authorization': `Bearer ${session}` }
  }).then((res) => res);

  if (isValid.status === 200) {
    return new Response(JSON.stringify(isValid.data), { status: isValid.status });
  } else {
    await fetch('/api/twitch/refresh').then((res) => res.json()).then((data) => data);
    return new Response(JSON.stringify(isValid.data), { status: isValid.status });
  }
};