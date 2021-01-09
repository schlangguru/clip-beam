enum SignalingType {
  OFFER = "OFFER",
  ERROR = "ERROR",
  ANSWER = "ANSWER",
  ICE = "ICE"
}

interface OfferPayload {
    offer: RTCOfferOptions,
    peerUuid: string
}

interface AnswerPayload {
    answer: RTCAnswerOptions,
    peerUuid: string
}

interface ICEPayload {
    candidate: RTCIceParameters,
    peerUuid: string
}

interface SignalingMsg {
  type: SignalingType;
  payload: OfferPayload | AnswerPayload | ICEPayload;
}
