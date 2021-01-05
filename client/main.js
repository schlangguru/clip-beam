import {v4 as uuidv4} from 'uuid';

const uuid = uuidv4();
document.querySelector('qr-code').setAttribute('value', uuid);

// export function waitForConnetion() {
//   // Create WebSocket connection.
//   const socket = new WebSocket("ws://localhost:9090");

//   // Connection opened
//   socket.addEventListener("open", function (event) {
//     const data = {
//       uuid: uuidv4(),
//     };
//     socket.send(JSON.stringify(data));
//   });

//   // Listen for messages
//   socket.addEventListener("message", function (event) {
//     console.log("Message from server ", event.data);
//   });
// }

// export function connect() {
//   console.log("Todo")
// }
