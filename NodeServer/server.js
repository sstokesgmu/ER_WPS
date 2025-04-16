import dgram from "dgram";
import { WebSocket } from "ws";
const server = dgram.createSocket("udp4");

let obj = {};

//Create a status object tracks the state of server connection

//rinfo => is remote address info
//Network security
server.on("message", (msg, rinfo) => {
  console.log(`I got a message: ${msg}`);
  console.log(
    `Remote address info: ${rinfo.family}, ${rinfo.address}, ${rinfo.port}`,
  );
  try {
    // Parse the string into an object
    const obj = JSON.parse(msg);
    console.log(typeof obj); // Should show 'object'
    console.log(obj); // Log the parsed object to verify it's correctly formatted
  } catch (e) {
    console.error("Failed to parse message as JSON:", e);
  }
});
server.on("listening", () => {
  const address = server.address();
  console.log(`Server listening  ${address.address}: ${address.port}`);
  obj[address] = address;
});

server.on("close", () => {
  console.log("Connection to web component closed stoping bridge");
});

const socket = new WebSocket(url);

socket.addEventListener("open", (event) => {
  console.log("WebSocket connection established");
  socket.send("Hello client");
});

socket.addEventListener("close", (event) => {
  console.log("WebSocket connection is closed");
});

server.bind(56789);
