const WEBSOCKET_URL = 'ws://localhost:9090';


class WebRTCService {
  registerClient(uuid: string) {
    // Create WebSocket connection.
    const socket = new WebSocket(WEBSOCKET_URL);

    // Connection opened
    socket.addEventListener('open', function (event) {
      const data = {
        uuid: uuid,
      };
      socket.send(JSON.stringify(data));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });
  }

  connectToDevice() {
    // TODO
  }
}

// Export singleton
const service = new WebRTCService();
export service;
