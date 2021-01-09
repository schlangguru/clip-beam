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

class WebRTCService {
  signalingSocket: WebSocket;
  rtcPeerConnection: RTCPeerConnection;
  uuid: string | null = null;
  peerUuid: string | null = null;
  dataChannel: RTCDataChannel | null = null;
  connectedCallbacks: (() => void)[] = [];
  messageCallbacks: ((event: MessageEvent) => void)[] = [];

  constructor() {
    this.signalingSocket = new WebSocket(SIGNALING_SERVER);
    this.signalingSocket.addEventListener("message", event =>
      this.onSignalingMessage(JSON.parse(event.data) as SignalingMsg)
    );

    this.rtcPeerConnection = new RTCPeerConnection(RTC_CONNECTION_CONFIG);
  }

  addConnectedCallback(cb: () => void) {
    this.connectedCallbacks.push(cb);
  }

  addMessageCallback(cb: (event: MessageEvent) => void) {
    this.messageCallbacks.push(cb);
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
    this.dataChannel = event.channel || event.target;
    this.dataChannel.onmessage = event => {
      for (const cb of this.messageCallbacks) {
        cb(event);
      }
    };

    for (const cb of this.connectedCallbacks) {
      cb();
    }
  }

  sendMessage(msg: string) {
    if (this.dataChannel) {
      this.dataChannel.send(msg);
    } else {
      console.error("No data channel open.");
    }
  }
}

// Export Singleton
const service = new WebRTCService();
export default service;
