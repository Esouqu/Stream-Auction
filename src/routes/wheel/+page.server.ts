import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    haveSeenWarning: locals.haveSeenWarning,
    haveSeenUpdates: locals.haveSeenUpdates
  }
};