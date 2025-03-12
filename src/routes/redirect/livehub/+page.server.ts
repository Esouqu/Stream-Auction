import {dev} from "$app/environment";
import type {IAuthTokenData} from "$lib/interfaces";
import {redirect} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {PUBLIC_LIVEHUB_CLIENT_ID, PUBLIC_LIVEHUB_SERVER_HOST} from "$env/static/public";
import {LIVEHUB_REFRESH_TOKEN_COOKIE, LIVEHUB_SECRET_KEY, LIVEHUB_TOKEN_COOKIE} from "$env/static/private";

export const load: PageServerLoad = async ({url, cookies}) => {
    const code = url.searchParams.get('code');
    const redirectUrl = dev ? 'http://localhost:5173/redirect/livehub' : 'https://stream-auction.vercel.app/redirect/livehub';
    const tokenUrl = `${PUBLIC_LIVEHUB_SERVER_HOST}/connect/token`;

    if (!code) throw redirect(300, '/');

    const tokenData = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'client_id': `${PUBLIC_LIVEHUB_CLIENT_ID}`,
            'client_secret': `${LIVEHUB_SECRET_KEY}`,
            'code': code,
            'redirect_uri': redirectUrl,
        }),
    }).then((res) => res.json()).then((data: IAuthTokenData) => data);

    cookies.set(LIVEHUB_TOKEN_COOKIE, tokenData.access_token, {
        path: '/',
        secure: !dev,
        expires: new Date(Date.now() + tokenData.expires_in)
    });

    cookies.set(LIVEHUB_REFRESH_TOKEN_COOKIE, tokenData.refresh_token, {
        path: '/',
        secure: !dev,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    });

    throw redirect(301, '/');
};
