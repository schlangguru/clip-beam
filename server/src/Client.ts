import WebSocket from "ws";

export default class Client {
    constructor(readonly uuid: string, readonly websocket: WebSocket) {}
}