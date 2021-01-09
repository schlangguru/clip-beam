"use strict";
console.log("Hello, World");
// const WebSocketServer = require("ws").Server;
// const websocketServer = new WebSocketServer({ port: 9090 });
// const clients = {};
// export class WebRTCSignalingServer {
//   constructor() {
//     // this.clients
//     console.log("hi");
//   }
// }
// function onMessage(connection, msg) {
//   let data;
//   try {
//     data = JSON.parse(msg);
//   } catch (e) {
//     data = {}
//   }
//   connection.name = data.uuid
//   clients[data.uuid] = connection;
// }
// function onClose(connection) {
//   if (connection.name) {
//     delete clients[connection.name]
//   }
// }
// server.on("connection", connection => {
//   connection.on("message", msg => onMessage(connection, msg));
//   connection.on("close", () => onClose(connection))
//   connection.send("Hello from server!");
// });
//# sourceMappingURL=server.js.map