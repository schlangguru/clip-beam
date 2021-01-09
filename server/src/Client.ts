import WebSocket from "ws";
import WebRTCSignalingServer from "./Server";

export default class Client {

  readonly server: WebRTCSignalingServer;
  readonly uuid: string;
  readonly websocket: WebSocket;

  constructor(server: WebRTCSignalingServer, uuid: string, websocket: WebSocket) {
    this.server = server;
    this.uuid = uuid;
    this.websocket = websocket;
    this.websocket.on("message", (msg) => this.onMessage(msg.toString()));
    this.websocket.on("close", () => this.onClose())
  }

  onMessage(message: string) {
    let signalingMsg;
    try {
      signalingMsg = JSON.parse(message) as SignalingMsg;
    } catch (e) {
      this.websocket.send({
        type: SignalingType.ERROR,
        payload: `Invalid message: ${message}`
      });
      return;
    }

    if (signalingMsg.type == SignalingType.OFFER) {
      const offerPayload = signalingMsg.payload as OfferPayload;
      this.offer(offerPayload.peerUuid, offerPayload.offer);
    } else if(signalingMsg.type == SignalingType.ANSWER) {
      const answerPayload = signalingMsg.payload as AnswerPayload;
      this.answer(answerPayload.peerUuid, answerPayload.answer);
    } else if(signalingMsg.type == SignalingType.ICE) {
      const icePayload = signalingMsg.payload as ICEPayload;
      this.ice(icePayload.peerUuid, icePayload.candidate);
    }else {
      console.log(`Unknown signaling message type '${signalingMsg.type}'`);
    }
  }

  onClose() {
    this.server.unregisterClient(this.uuid);
  }

  /**
   * This client wants to connect to client B.
   *
   * @param websocket
   */
  offer(peerUuid: string, offer: RTCOfferOptions) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send({
        type: SignalingType.OFFER,
        payload: {
          offer: offer,
          peerUuid: this.uuid
        }
      })
    } else {
      this.websocket.send({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      });
    }
  }

  answer(peerUuid: string, answer: RTCAnswerOptions) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send({
        type: SignalingType.OFFER,
        payload: {
          answer: answer,
          peerUuid: this.uuid
        }
      })
    } else {
      this.websocket.send({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      });
    }
  }


  ice(peerUuid: string, candidate: RTCIceParameters) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send({
        type: SignalingType.ICE,
        payload: {
          candidate: candidate,
          peerUuid: this.uuid
        }
      })
    } else {
      this.websocket.send({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      });
    }
  }

}
