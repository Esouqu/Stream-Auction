import { SOCKET_STATE } from '$lib/constants';
import type { IDonationAlertsUserData, IDonationData } from '$lib/interfaces';
import { writable } from 'svelte/store';
import actionManager from './actionManager';

function createCentrifugo() {
  const state = writable<SOCKET_STATE>(SOCKET_STATE.CLOSED);
  let socket: WebSocket;

  async function connect() {
    const donationAlertsUser = await fetch('/api/donationalerts/user')
      .then((res) => res.json())
      .then((data: IDonationAlertsUserData) => data);

    state.set(SOCKET_STATE.CONNECTING);
    socket = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          params: {
            token: donationAlertsUser.socket_connection_token
          },
          id: 1
        })
      );
    });

    socket.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data);
      const centrifugoChannel = `$alerts:donation_${donationAlertsUser.id}`;

      if (message.id === 1) {
        const socketToken = await fetch('/api/donationalerts/pubsub', {
          method: 'POST',
          body: JSON.stringify({
            channels: [centrifugoChannel],
            client: message.result.client
          })
        }).then((res) => res.json()).then((data: string) => data);

        socket.send(
          JSON.stringify({
            params: {
              channel: centrifugoChannel,
              token: socketToken
            },
            method: 1,
            id: 2
          })
        );

        state.set(SOCKET_STATE.OPEN);
      }

      if (!message.result.type && message.result.channel === centrifugoChannel) {
        const donation: IDonationData = message.result.data.data;
        const username = donation.username ?? 'Аноним';
        const roundedAmount = Math.round(donation.amount_in_user_currency);

        actionManager.processDonation({
          ...donation,
          username,
          type: 'Donation Alerts',
          amount_in_user_currency: roundedAmount
        });
      }
    });

    socket.addEventListener('close', () => {
      state.set(SOCKET_STATE.CLOSED);
    });

    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
      state.set(SOCKET_STATE.CLOSED);
    });
  }

  function disconnect() {
    socket.close();
    state.set(SOCKET_STATE.CLOSED);
  }

  return {
    state,
    connect,
    disconnect,
  }
}

const centrifugo = createCentrifugo();

export default centrifugo;