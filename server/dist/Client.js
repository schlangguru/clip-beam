"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SignalingMessage_1 = require("./SignalingMessage");
class Client {
    constructor(server, uuid, websocket) {
        this.server = server;
        this.uuid = uuid;
        this.websocket = websocket;
        this.websocket.on("message", (msg) => this.onMessage(msg.toString()));
        this.websocket.on("close", () => this.onClose());
    }
    onMessage(message) {
        let signalingMsg;
        try {
            signalingMsg = JSON.parse(message);
        }
        catch (e) {
            this.websocket.send({
                type: SignalingMessage_1.SignalingType.ERROR,
                payload: `Invalid message: ${message}`
            });
            return;
        }
        if (signalingMsg.type == SignalingMessage_1.SignalingType.OFFER) {
            const offerPayload = signalingMsg.payload;
            this.offer(offerPayload.peerUuid, offerPayload.offer);
        }
        else if (signalingMsg.type == SignalingMessage_1.SignalingType.ANSWER) {
            const answerPayload = signalingMsg.payload;
            this.answer(answerPayload.peerUuid, answerPayload.answer);
        }
        else if (signalingMsg.type == SignalingMessage_1.SignalingType.ICE_CANDIATE) {
            const icePayload = signalingMsg.payload;
            this.iceCandidate(icePayload.peerUuid, icePayload.candidate);
        }
        else {
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
    offer(peerUuid, offer) {
        const peer = this.server.clients.get(peerUuid);
        if (peer) {
            peer.websocket.send({
                type: SignalingMessage_1.SignalingType.OFFER,
                payload: {
                    offer: offer,
                    peerUuid: this.uuid
                }
            });
        }
        else {
            this.websocket.send({
                type: SignalingMessage_1.SignalingType.ERROR,
                payload: `No peer with id ${peerUuid} found`,
            });
        }
    }
    answer(peerUuid, answer) {
        const peer = this.server.clients.get(peerUuid);
        if (peer) {
            peer.websocket.send({
                type: SignalingMessage_1.SignalingType.OFFER,
                payload: {
                    answer: answer,
                    peerUuid: this.uuid
                }
            });
        }
        else {
            this.websocket.send({
                type: SignalingMessage_1.SignalingType.ERROR,
                payload: `No peer with id ${peerUuid} found`,
            });
        }
    }
    iceCandidate(peerUuid, candidate) {
        const peer = this.server.clients.get(peerUuid);
        if (peer) {
            peer.websocket.send({
                type: SignalingMessage_1.SignalingType.ICE_CANDIATE,
                payload: {
                    candidate: candidate,
                    peerUuid: this.uuid
                }
            });
        }
        else {
            this.websocket.send({
                type: SignalingMessage_1.SignalingType.ERROR,
                payload: `No peer with id ${peerUuid} found`,
            });
        }
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map