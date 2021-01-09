import WebSocket from "ws";
import WebRTCSignalingServer from "./Server";
import { SignalingType, SignalingMsg, OfferPayload, AnswerPayload, ICECandidatePayload } from "./SignalingMessage";

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
    console.log("Signal:", message);
    let signalingMsg;
    try {
      signalingMsg = JSON.parse(message) as SignalingMsg;
    } catch (e) {
      this.websocket.send(JSON.stringify({
        type: SignalingType.ERROR,
        payload: `Invalid message: ${message}`
      }));
      return;
    }

    if (signalingMsg.type == SignalingType.OFFER) {
      const offerPayload = signalingMsg.payload as OfferPayload;
      this.offer(offerPayload.peerUuid, offerPayload.offer);
    } else if(signalingMsg.type == SignalingType.ANSWER) {
      const answerPayload = signalingMsg.payload as AnswerPayload;
      this.answer(answerPayload.peerUuid, answerPayload.answer);
    } else if(signalingMsg.type == SignalingType.ICE_CANDIATE) {
      const icePayload = signalingMsg.payload as ICECandidatePayload;
      this.iceCandidate(icePayload.peerUuid, icePayload.candidate);
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
  offer(peerUuid: string, offer: RTCSessionDescriptionInit) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send(JSON.stringify({
        type: SignalingType.OFFER,
        payload: {
          offer: offer,
          peerUuid: this.uuid
        }
      }))
    } else {
      this.websocket.send(JSON.stringify({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      }));
    }
  }

  answer(peerUuid: string, answer: RTCSessionDescriptionInit) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send(JSON.stringify({
        type: SignalingType.OFFER,
        payload: {
          answer: answer,
          peerUuid: this.uuid
        }
      }));
    } else {
      this.websocket.send(JSON.stringify({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      }));
    }
  }


  iceCandidate(peerUuid: string, candidate: RTCIceCandidate) {
    const peer = this.server.clients.get(peerUuid);
    if (peer) {
      peer.websocket.send(JSON.stringify({
        type: SignalingType.ICE_CANDIATE,
        payload: {
          candidate: candidate,
          peerUuid: this.uuid
        }
      }));
    } else {
      this.websocket.send(JSON.stringify({
        type: SignalingType.ERROR,
        payload: `No peer with id ${peerUuid} found`,
      }));
    }
  }

}
