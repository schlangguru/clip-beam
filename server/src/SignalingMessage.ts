export enum SignalingType {
  REGISTER = "REGISTER",
  OFFER = "OFFER",
  ERROR = "ERROR",
  ANSWER = "ANSWER",
  ICE_CANDIATE = "ICE_CANDIATE"
}

export interface OfferPayload {
    offer: RTCOfferOptions,
    peerUuid: string
}

export interface AnswerPayload {
    answer: RTCAnswerOptions,
    peerUuid: string
}

export interface ICECandidatePayload {
    candidate: RTCIceParameters,
    peerUuid: string
}

export interface SignalingMsg {
  type: SignalingType;
  payload: string | OfferPayload | AnswerPayload | ICECandidatePayload;
}
