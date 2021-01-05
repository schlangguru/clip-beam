const WebSocketServer = require("ws").Server;

const server = new WebSocketServer({ port: 9090 });
const clients = {};

function onMessage(connection, msg) {
  let data;
  try {
    data = JSON.parse(msg);
  } catch (e) {
    data = {}
  }

  connection.name = data.uuid
  clients[data.uuid] = connection;
}

function onClose(connection) {
  if (connection.name) {
    delete clients[connection.name]
  }
}

server.on("connection", connection => {
  connection.on("message", msg => onMessage(connection, msg));
  connection.on("close", () => onClose(connection))

  connection.send("Hello from server!");
});
