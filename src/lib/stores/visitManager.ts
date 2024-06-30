import storable from './storable';

function createVisitManager() {
  const lastSeenUpdates = storable<number | undefined>(undefined, 'lastSeenUpdates');
  const lastSeenWarning = storable<number | undefined>(undefined, 'lastSeenWarning');

  function setLastSeenUpdates() {
    lastSeenUpdates.set(new Date().getTime());
  }

  function setLastSeenWarning() {
    lastSeenWarning.set(new Date().getTime());
  }

  return {
    lastSeenUpdates,
    lastSeenWarning,
    setLastSeenUpdates,
    setLastSeenWarning,

  }
}

const visitManager = createVisitManager();

export default visitManager;