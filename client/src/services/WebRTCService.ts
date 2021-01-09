import {
  SignalingType,
  SignalingMsg,
  OfferPayload,
  AnswerPayload,
  ICECandidatePayload
} from "./SignalingMessage";

const SIGNALING_SERVER = "ws://192.168.178.44:9090";
const RTC_CONNECTION_CONFIG = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};
const DATA_CHANNEL_NAME = "data-channel";

export class WebRTCService {
  signalingSocket: WebSocket;
  rtcPeerConnection: RTCPeerConnection;
  uuid: string | null = null;
  peerUuid: string | null = null;

  constructor() {
    this.signalingSocket = new WebSocket(SIGNALING_SERVER);
    this.signalingSocket.addEventListener("message", event =>
      this.onSignalingMessage(JSON.parse(event.data) as SignalingMsg)
    );

    this.rtcPeerConnection = new RTCPeerConnection(RTC_CONNECTION_CONFIG);
  }

  registerClient(uuid: string) {
    this.signalingSocket.addEventListener("open", () => {
      this.uuid = uuid;
      this.sendSignal({
        type: "REGISTER",
        payload: uuid
      });
    });
  }

  async connectToDevice(peerUuid: string) {
    this.peerUuid = peerUuid;

    this.rtcPeerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.sendSignal({
          type: "ICE_CANDIDATE",
          payload: {
            candidate: event.candidate,
            peerUuid: this.peerUuid
          }
        });
      }
    };

    this.initDataChannel();

    const offer = await this.rtcPeerConnection.createOffer();
    this.rtcPeerConnection.setLocalDescription(offer);
    this.sendSignal({
      type: "OFFER",
      payload: {
        offer: offer,
        peerUuid: this.peerUuid
      }
    });
  }

  onSignalingMessage(message: SignalingMsg) {
    if (message.type == SignalingType.ERROR) {
      console.error(message.payload);
    } else if (message.type === SignalingType.OFFER) {
      const payload = message.payload as OfferPayload;
      this.onOffer(payload.peerUuid, payload.offer);
    } else if (message.type === SignalingType.ANSWER) {
      const payload = message.payload as AnswerPayload;
      this.onAnswer(payload.answer);
    } else if (message.type === SignalingType.ICE_CANDIDATE) {
      const payload = message.payload as ICECandidatePayload;
      this.onIceCandidate(payload.candidate);
    }
  }

  async onOffer(peerUuid: string, offer: RTCSessionDescriptionInit) {
    this.peerUuid = peerUuid;
    this.rtcPeerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    this.rtcPeerConnection.ondatachannel = event =>
      this.onDataChannelOpened(event);
    const answer = await this.rtcPeerConnection.createAnswer();
    this.rtcPeerConnection.setLocalDescription(answer);
    this.sendSignal({
      type: SignalingType.ANSWER,
      payload: {
        answer: answer,
        peerUuid: this.peerUuid
      }
    });
  }

  async onAnswer(answer: RTCSessionDescriptionInit) {
    this.rtcPeerConnection.setRemoteDescription(answer);
  }

  async onIceCandidate(candidate: RTCIceCandidateInit) {
    this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  sendSignal(signal: object) {
    this.signalingSocket.send(JSON.stringify(signal));
  }

  initDataChannel() {
    const options = { ordered: true };
    const dataChannel = this.rtcPeerConnection.createDataChannel(
      DATA_CHANNEL_NAME,
      options
    );
    dataChannel.onopen = event =>
      this.onDataChannelOpened(event as RTCDataChannelEvent);
  }

  onDataChannelOpened(event: RTCDataChannelEvent) {
    console.log("Data Channel opened");
    const dataChannel = event.channel || event.target;
    dataChannel.onmessage = event => {
      console.log("Got message:", event.data);
    };
    dataChannel.send(`Hi my name is ${this.uuid}`);
  }
}
