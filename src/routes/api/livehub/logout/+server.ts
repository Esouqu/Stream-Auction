import { LIVEHUB_REFRESH_TOKEN_COOKIE, LIVEHUB_TOKEN_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
    cookies.delete(LIVEHUB_TOKEN_COOKIE, { path: '/' });
    cookies.delete(LIVEHUB_REFRESH_TOKEN_COOKIE, { path: '/' });

    return new Response('OK', { status: 200 });
};
