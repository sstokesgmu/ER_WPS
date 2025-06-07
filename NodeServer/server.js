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



const mapData = {
  Limgrave: [
    [73.8, 347.3],
    [340.9, 603.8],
    [90.5, 123.2],
    [63.36, -88.02],
    [36.4, -69.14],
    [54.27, -26.14],
    [104.47, -114.78],
    [0, 44.8],
    [-8.8, -18.51],
    [98.48, 112.97],
  ],
  Calied: [
    [151.76, 30.32],
    [122.07, -82.49],
    [162.27, -23.74],
    [38.83, -82.52],
    [145.6, 117.79],
    [345.36, 14.79],
    [-4.94, -111.65],
    [91.76, 18.11],
    [33.64, -43.98],
  ],
  Liurinia: [
    [337.97, -71.04],
    [151.21, -63.07],
    [235.98, 51.3],
    [261.09, -65.16],
    [476.0, 11.35],
    [367, -62.62],
    [424, 120],
    [288.41, 82.06],
  ],
};
//Create a status object tracks the state of server connection
//rinfo => is remote address info
//Network security

let ref;
udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`Starting server`);
  console.log(`Server listening ${address.address}: ${address.port}`);
  const client = new MongoClient(process.env.MONGO_URI);
  ref = {
    FACTORY: new Factory(),
    TREE:new KDTree(2,Object.values(mapData).flat()),
    CLIENT: client
  }
  Object.freeze(ref);
});

udpServer.on("message", (msg, rinfo) => {
    console.log('Message Recieved ...'); // Log the parsed object to verify it's correctly formatted
    const obj = JSON.parse(msg); 
    console.log(obj)
    //* At this point we would have to destruct the message because it will include the Player NPC maybe more info -> use the Factory here 
    //? What if this is the last message from the sever -> Then we stop the server and finish the exit call  
    try {    
      const point = ref.TREE.NearestToTarget(obj)
      console.log(point);
      let region = undefined;
      for (let key in mapData) {
        if(mapData[key].some(el => el == point.closestPoint.point)) {
          region = key; break;
        }
      }

      console.log("Player is in: " + region);
      run(region).catch(console.dir) //? Why is the catch outside of the scope 
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
  } finally {
    await ref.CLIENT.close()
  }
}


udpServer.on("close", () => {
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
