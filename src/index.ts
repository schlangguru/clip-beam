import WebRTCSignalingServer from "./Server";

const PORT = process.env.PORT || 9090;
const server = new WebRTCSignalingServer(PORT as number);

console.log(`Clip Beam Signaling Server started on port ${PORT}`);