// import type { IDonationAlertsRefreshToken } from "$lib/interfaces";
// import type { Handle } from "@sveltejs/kit";

// export const handle: Handle = async ({ event, resolve }) => {
//   const routeId = event.route.id;

//   if (routeId?.startsWith('/api') || routeId?.startsWith('/redirect')) return await resolve(event);

//   const refreshToken = event.cookies.get('daRefreshToken');
//   let session = event.cookies.get('daSession');

//   if (!session && refreshToken) {
//     const refreshTokenResponse = await event.fetch('/api/donationalerts/refresh', { method: 'POST' })
//       .then((res) => res);

//     if (refreshTokenResponse.ok) {
//       const newSessionToken = await refreshTokenResponse.json()
//         .then((data: IDonationAlertsRefreshToken) => data);

//       session = newSessionToken.access_token;
//       console.log('token refreshed')
//     } else {
//       console.log('deleted')
//       event.cookies.delete('daRefreshToken', { path: '/' });
//     }
//   }

//   event.locals.isAuthorizedToDonationAlerts = !!session;

//   return await resolve(event);
// }