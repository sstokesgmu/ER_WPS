import dgram from "dgram";
import {WebSocketServer, WebSocket} from "ws";
import { Factory } from "./utilities/Factory.js";
import { MongoClient } from "mongodb";

import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const udpServer = dgram.createSocket("udp4");

let obj = {};
let playerLoaded = false;
let FACTORY;

//? What is this dumbass
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
config({ path: path.resolve(__dirname, ".env") });
//?

//Create a status object tracks the state of server connection
//rinfo => is remote address info
//Network security



const wss = new WebSocketServer({
  port: 8080,
  host:'127.0.0.1',
   // Add CORS headers in the server upgrade event
    verifyClient: (info, callback) => {
        // Allow all origins in development
        callback(true, 200, 'OK', {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });
    }
})

let ref;
let wsClients = new Set();

udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`Starting server`);
  console.log(`Server listening ${address.address}: ${address.port}`);
  const client = new MongoClient(process.env.MONGO_URI);
  ref = { FACTORY: new Factory(), CLIENT: client };
  Object.freeze(ref);
});

// Also handle the upgrade event
wss.on('headers', (headers) => {
    headers.push('Access-Control-Allow-Origin: *');
});

//Print Server information when it starts 
wss.on('listening', () => {
  console.log(`WebSocket Server Information:
      Port: ${wss.address().port}
      Address: ${wss.address().address}
      Number of clients: ${wss.clients.size} 
      URL: ${wss.address().family}
    `);
})

wss.on(`connection`, (ws, request) => {
  console.log(`Client Connection Information:
        Server clients: ${wss.clients.size}
        Client IP: ${request.socket.remoteAddress}
        Client Port: ${request.socket.remotePort}
        Client State: ${ws.readyState}
        Protocol: ${ws.protocol}
        URL: ${request.url}
    `);

  wsClients.add(ws);
  
  //Handle incoming WebSocket messages 
  ws.on('message', (message)=>{
    console.log('Recieved:', message.toString());

    ws.send(JSON.stringify({
      type:'ack',
      content: 'Message Recieved',
      originalMessage: message.toString()
    }))
  })


  ws.on('close', ()=>{
    wsClients.delete(ws);
    console.log('Remove Client');
  })

  ws.on('error', (error) => {
    console.error('Websocket error:', error);
  })
});

//Error handling 
wss.on('error', (error) => {
  console.error('WebSocket Server Error: ', error);
})

wss.on('close', ()=>{
  console.log("Closing websocket server");
})



udpServer.on("message", async (msg, rinfo) => {
  console.log("Message Recieved ..."); // Log the parsed object to verify it's correctly formatted
  const obj = JSON.parse(msg);
  //* At this point we would have to destruct the message because it will include the Player NPC maybe more info -> use the Factory here

  //? What if this is the last message from the sever -> Then we stop the server and finish the exit call
  try {
    ref.FACTORY.Build(obj);
    ref.FACTORY.Send();
    let location = ref.FACTORY.GetLocation().GetRegion();
    const result = await run(location);
 
    wsClients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type:'location_update',
          data: {
            location: location,
            result: result,
          }
        }));
      }
    });

    

   //run((ref.Factory.GetLocation()) //? Why is the catch outside of the scope
    //! Based on the result we can query Mongo DB
    //Send that data to the frontend (Current player pos and region located in)
    //When the player loads the we find the origin again loads => teleport, die, start game
    // .send(`Hello Client ${result}`);

    //stop();
    // udpServer.close();
    // wss.close();
 
  } catch (e) {
    console.error("Failed to parse message as JSON:", e);
  }
});

async function run(value) {
  try {
    const collection = ref.CLIENT.db("WPS").collection("locations");
    const query = { region: `${value}` };
    console.log("Querying Collection ... " + collection);
    return await collection.findOne(query);
  } catch (e) {
    console.dir;
  }
};

async function stop() {
  await ref.CLIENT.close();
}

udpServer.on("close", () => {
  stop();
  console.log("Closing Lua Client Connection...");
});

udpServer.bind(4001);
