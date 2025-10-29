import { DONATIONALERTS_TOKEN_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

interface ISocketTokenData {
	channels: {
		token: string,
	}[]
}

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	const token = cookies.get(DONATIONALERTS_TOKEN_COOKIE);
	const body = await request.json();

	if (!token) return new Response('No donation alerts session available', { status: 401 });

	const url = 'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = await response.text();
			return new Response(error, { status: response.status });
		}

		const data = await response.json() as ISocketTokenData;

		return new Response(JSON.stringify(data.channels[0].token), { status: 200 });
	} catch (error) {
		console.error('Error subscribing to donation alerts Centrifuge:', error);
		return new Response('Error subscribing to donation alerts Centrifuge', { status: 500 });
	}
};

