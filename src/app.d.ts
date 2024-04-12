// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      isAuthorizedToDonationAlerts: boolean;
    }
    interface PageData {
      isAuthorizedToDonationAlerts: boolean;
    }
    // interface Platform {}
  }
}


export { };
