class VisitApi {
  public setLastSeenUpdates(date = new Date().toISOString()) {
    fetch('/api/seen-updates', {
      method: 'POST',
      body: JSON.stringify({ createdAt: date })
    });
  }

  public setLastSeenWarning(date = new Date().toISOString()) {
    fetch('/api/seen-warning', {
      method: 'POST',
      body: JSON.stringify({ createdAt: date })
    });
  }
}

const visitApi = new VisitApi();

export default visitApi;