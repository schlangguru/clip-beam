"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Client_1 = __importDefault(require("./Client"));
const clients = {};
var SignalingType;
(function (SignalingType) {
    SignalingType["REGISTER"] = "register";
})(SignalingType || (SignalingType = {}));
class WebRTCSignalingServer {
    constructor(port) {
        this.clients = new Set();
        this.wsServer = new ws_1.default.Server({ port: port });
        this.wsServer.on("connection", (socket) => this.initWebsocket(socket));
    }
    initWebsocket(websocket) {
        websocket.on("message", (msg) => this.onMessage(websocket, msg.toString()));
        websocket.on("close", () => this.onClose(websocket));
    }
    onMessage(websocket, message) {
        let signalingMsg;
        try {
            signalingMsg = JSON.parse(message);
        }
        catch (e) {
            websocket.send(`Invalid message: ${message}`);
            return;
        }
        const mapping = {
            [SignalingType.REGISTER]: this.registerClient.bind(this)
        };
        mapping[signalingMsg.type](signalingMsg.payload, websocket);
    }
    onClose(websocket) {
        for (let client of this.clients) {
            const state = client.websocket.readyState;
            if (state == ws_1.default.CLOSED || state == ws_1.default.CLOSING) {
                this.clients.delete(client);
            }
        }
    }
    registerClient(uuid, websocket) {
        const client = new Client_1.default(uuid, websocket);
        this.clients.add(client);
    }
}
exports.default = WebRTCSignalingServer;
//# sourceMappingURL=Server.js.map