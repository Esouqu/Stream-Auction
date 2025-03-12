import { dev } from "$app/environment";
import { PUBLIC_LIVEHUB_CLIENT_ID, PUBLIC_LIVEHUB_SERVER_HOST} from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    const scope = 'oauth:alert:listen oauth:alert:list offline_access';
    const redirectUrl = dev ? 'http://localhost:5173/redirect/livehub' : 'https://stream-auction.vercel.app/redirect/livehub';
    const url = `${PUBLIC_LIVEHUB_SERVER_HOST}/connect/authorize?client_id=${PUBLIC_LIVEHUB_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}`;

    throw redirect(302, url);
};


