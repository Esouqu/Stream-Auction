import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    isAuthorizedToDonationAlerts: locals.isAuthorizedToDonationAlerts,
  }
};