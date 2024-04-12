import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ setHeaders }) => {
  setHeaders({ 'Cache-Control': 'no-cache' });
};