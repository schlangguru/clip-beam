export enum SignalingType {
  REGISTER = "REGISTER",
  OFFER = "OFFER",
  ERROR = "ERROR",
  ANSWER = "ANSWER",
  ICE_CANDIATE = "ICE_CANDIATE"
}

export interface OfferPayload {
  offer: RTCSessionDescriptionInit;
  peerUuid: string;
}

export interface AnswerPayload {
  answer: RTCSessionDescriptionInit;
  peerUuid: string;
}

export interface ICECandidatePayload {
  candidate: RTCIceCandidate;
  peerUuid: string;
}

export interface SignalingMsg {
  type: SignalingType;
  payload: string | OfferPayload | AnswerPayload | ICECandidatePayload;
}
