import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  console.log('locals: ', locals);
  return {
    haveSeenUpdates: locals.haveSeenUpdates,
    haveSeenWarning: locals.haveSeenWarning
  }
};