import dgram from "dgram";
import { WebSocket } from "ws";
import { KDTree } from "./kdTree.js";
import { Factory } from "./utilities/modules.js";
import {MongoClient} from "mongodb"


import path from 'path'
import { fileURLToPath } from "url";
import { config } from "dotenv";


const udpServer = dgram.createSocket("udp4");

let obj = {};
let playerLoaded = false;
let FACTORY 



//? What is this dumbass 
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
config({ path: path.resolve(__dirname, '.env') });
//?



//Create a status object tracks the state of server connection
//rinfo => is remote address info
//Network security

let ref;
udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`Starting server`);
  console.log(`Server listening ${address.address}: ${address.port}`);
  const client = new MongoClient(process.env.MONGO_URI);
  ref = {FACTORY: new Factory(),CLIENT: client}
  Object.freeze(ref);
});

udpServer.on("message", (msg, rinfo) => {
    console.log('Message Recieved ...'); // Log the parsed object to verify it's correctly formatted
    const obj = JSON.parse(msg); 


    //* At this point we would have to destruct the message because it will include the Player NPC maybe more info -> use the Factory here
   
    //? What if this is the last message from the sever -> Then we stop the server and finish the exit call  
    try {
      ref.FACTORY.Build(obj);   
      ref.FACTORY.Send();
      let a = ref.FACTORY.GetLocation().GetRegion()
      run(a)
      //run((ref.Factory.GetLocation()) //? Why is the catch outside of the scope 
      //! Based on the result we can query Mongo DB
      //Send that data to the frontend (Current player pos and region located in)
      //When the player loads the we find the origin again loads => teleport, die, start game
    } catch (e) {
      console.error("Failed to parse message as JSON:", e);
    }
});

async function run(value){
  try {
    const collection = (ref.CLIENT.db('WPS')).collection('locations');
    const query = {region: `${value}`};
    console.log("Querying Collection ... " + collection); 
    const location = await collection.findOne(query);
    console.log(location);
  } catch(e) {
     console.dir;
  }
}

async function stop()
{
  await ref.CLIENT.close();
}

udpServer.on("close", () => {
  stop();
  console.log("Connection closed");
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
