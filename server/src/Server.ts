import Websocket from "ws";
import Client from "./Client";
import { SignalingType, SignalingMsg } from "./SignalingMessage";

export default class WebRTCSignalingServer {

  wsServer: Websocket.Server;
  clients: Map<string, Client> = new Map();

  constructor(port: number) {
    this.wsServer = new Websocket.Server({port: port});
    this.wsServer.on("connection", (socket) => this.onConnection(socket));
  }

  onConnection(websocket: Websocket) {
    websocket.on("message", (msg) => this.onMessage(websocket, msg.toString()));
  }

  onMessage(websocket: Websocket, message: string) {
    let signalingMsg;
    try {
      signalingMsg = JSON.parse(message) as SignalingMsg;
    } catch (e) {
      websocket.send({
        type: SignalingType.ERROR,
        payload: `Invalid message: ${message}`
      });
      return;
    }

    if (signalingMsg.type == SignalingType.REGISTER) {
      this.registerClient(websocket, signalingMsg.payload as string);
    }
  }

  /**
   * Register client with uuid.
   *
   * @param uuid
   * @param websocket
   */
  registerClient(websocket: Websocket, uuid: string) {
    const client = new Client(this, uuid, websocket);
    this.clients.set(uuid, client);
  }

  unregisterClient(uuid: string) {
    this.clients.delete(uuid);
  }

}





