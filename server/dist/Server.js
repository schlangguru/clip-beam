"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Client_1 = __importDefault(require("./Client"));
const SignalingMessage_1 = require("./SignalingMessage");
class WebRTCSignalingServer {
    constructor(port) {
        this.clients = new Map();
        this.wsServer = new ws_1.default.Server({ port: port });
        this.wsServer.on("connection", (socket) => this.onConnection(socket));
    }
    onConnection(websocket) {
        websocket.on("message", (msg) => this.onMessage(websocket, msg.toString()));
    }
    onMessage(websocket, message) {
        let signalingMsg;
        try {
            signalingMsg = JSON.parse(message);
        }
        catch (e) {
            websocket.send(JSON.stringify({
                type: SignalingMessage_1.SignalingType.ERROR,
                payload: `Invalid message: ${message}`
            }));
            return;
        }
        if (signalingMsg.type == SignalingMessage_1.SignalingType.REGISTER) {
            this.registerClient(websocket, signalingMsg.payload);
        }
    }
    /**
     * Register client with uuid.
     *
     * @param uuid
     * @param websocket
     */
    registerClient(websocket, uuid) {
        const client = new Client_1.default(this, uuid, websocket);
        this.clients.set(uuid, client);
    }
    unregisterClient(uuid) {
        this.clients.delete(uuid);
    }
}
exports.default = WebRTCSignalingServer;
//# sourceMappingURL=Server.js.map