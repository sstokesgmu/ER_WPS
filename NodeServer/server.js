import dgram from "dgram";
import { WebSocket } from "ws";

const udpServer = dgram.createSocket("udp4");

let obj = {};
let playerLoaded = false;

//Create a status object tracks the state of server connection
//rinfo => is remote address info
//Network security
udpServer.on("message", (msg, rinfo) => {
  console.log(`Recieved data: ${msg}`);
  try {
    // Parse the string into an object
    const obj = JSON.parse(msg);
    console.log(typeof obj); // Should show 'object'
    console.log('Recieved message from'); // Log the parsed object to verify it's correctly formatted
    console.log(obj)

    //When the player loads the we find the origin again loads => teleport, die, start game
  } catch (e) {
    console.error("Failed to parse message as JSON:", e);
  }
});
udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`Starting server`);
  console.log(`Server listening ${address.address}: ${address.port}`);
});

udpServer.on("close", () => {
  console.log("Connection to web component closed stoping bridge");
});

// const socket = new WebSocket(url);

// socket.addEventListener("open", (event) => {
//   console.log("WebSocket connection established");
//   socket.send("Hello client");
// });

// socket.addEventListener("close", (event) => {
//   console.log("WebSocket connection is closed");
// });

udpServer.bind(4001);
