class VisitApi {
  public setLastSeenUpdates() {
    fetch('/api/seen-updates', { method: 'POST' });
  }

  public setLastSeenWarning() {
    fetch('/api/seen-warning', { method: 'POST' });
  }
}

const visitApi = new VisitApi();

export default visitApi;