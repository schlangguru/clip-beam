import Websocket from "ws";
import { URL } from "url";
import Client from "./Client";


export default class WebRTCSignalingServer {

  wsServer: Websocket.Server;
  clients: Map<string, Client> = new Map();

  constructor(port: number) {
    this.wsServer = new Websocket.Server({port: port});
    this.wsServer.on("connection", (socket) => this.registerClient(socket));
  }

  /**
   * Register client with uuid.
   *
   * @param uuid
   * @param websocket
   */
  registerClient(websocket: Websocket) {
    const url = new URL(websocket.url);
    const uuid = url.searchParams.get("uuid");

    if (uuid) {
      const client = new Client(this, uuid, websocket);
      this.clients.set(uuid, client);
    } else {
      websocket.send({
        type: SignalingType.ERROR,
        payload: "Missing UUID in url query."
      });
      websocket.close();
    }
  }

  unregisterClient(uuid: string) {
    this.clients.delete(uuid);
  }

}





