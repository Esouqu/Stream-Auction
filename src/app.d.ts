// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      haveSeenUpdates: boolean;
      haveSeenWarning: boolean;
    }
    interface PageData {
      isAuthorizedToDonationAlerts: boolean;
      haveSeenUpdates: boolean;
      haveSeenWarning: boolean;
    }
    // interface Platform {}
  }
}


export { };
