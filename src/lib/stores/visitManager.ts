import storable from './storable';

function createVisitManager() {
  const lastSeenUpdates = storable<number | null>(null, 'lastSeenUpdates');
  const lastSeenWarning = storable<number | null>(null, 'lastSeenWarning');

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