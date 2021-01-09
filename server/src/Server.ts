import WebSocket from "ws";
import Websocket from "ws";
import Client from "./Client";

const clients = {};

enum SignalingType {
  REGISTER = "register"
}

interface SignalingMsg {
  type: SignalingType,
  payload: string
}

export default class WebRTCSignalingServer {

  wsServer: Websocket.Server;
  clients: Set<Client> = new Set();

  constructor(port: number) {
    this.wsServer = new Websocket.Server({port: port});
    this.wsServer.on("connection", (socket) => this.initWebsocket(socket));
  }

  initWebsocket(websocket: Websocket) {
    websocket.on("message", (msg) => this.onMessage(websocket, msg.toString()));
    websocket.on("close", () => this.onClose(websocket))

    websocket.send("Websocket connected.");
  }

  onMessage(websocket: Websocket, message: string) {
    console.log("Message recieved", message)
    let signalingMsg;
    try {
      signalingMsg = JSON.parse(message) as SignalingMsg;
    } catch (e) {
      websocket.send(`Invalid message: ${message}`);
      return;
    }

    const mapping = {
      [SignalingType.REGISTER]: this.registerClient.bind(this)
    }

    mapping[signalingMsg.type](signalingMsg.payload, websocket);
  }

  onClose(websocket: Websocket) {
    for (let client of this.clients) {
      const state = client.websocket.readyState;
      if (state == Websocket.CLOSED || state == Websocket.CLOSING) {
        this.clients.delete(client);
      }
    }
  }

  registerClient(uuid: string, websocket: WebSocket) {
    const client = new Client(uuid, websocket);
    this.clients.add(client);
  }
}





