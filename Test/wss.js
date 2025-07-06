import { WebSocketServer, WebSocket } from 'ws';
import {mapData,origin} from './coords';

const wss = new WebSocketServer({
    port:8080,
    host:"127.0.0.1",
});

const wsClients = new Set();

wss.on("header", (headers) => {
    console.log(headers);
    headers.push("Access-Control-Allow-Origin: *");
});

wss.on("listening", ()=>{
    console.log(`WebSocket Server Information:
        Port: ${wss.address().port}
        Address: ${wss.address().address}
        Number of clients: ${wss.clients.size}
        URL: ${wss.address().family}
    `);
});

wss.on(`connection`, (ws, request) => {
    console.log(
        `Client Connection Information: 
            Server Clients: ${wss.clients.size}
            Client IP: ${request.socket.remoteAddress}
            Client Port: ${request.socket.remotePort}
            Client State: ${ws.readyState}
            Protocol: ${ws.protocol}
            URL: ${request.url}
        `
    );

    wsClients.add(ws);

    //Handle incoming WebSocket messages
    ws.on("message", (message)=>{
        console.log("Recieved: ", message.toString()); 

           ws.send(
                JSON.stringify({
                    type: "ack",
                    content: "Message Recieved",
                    originalMessage: message.toString(),
                })
                );
    });

});

wss.on("error", (error) => {
    console.error(`Server Error: ${error}`);
});

wss.on("close", ()=>{
    console.log("Closing connection to the server");
});



let increment = 0;
let x =0;
let y =0;
setInterval(()=>{
    wsClients.forEach(client => {
        if(client.readyState == WebSocket.OPEN)
        {
            client.send(JSON.stringify({
                type:'location-update',
                data:{
                    origin:origin,
                    coords: [x + increment, y + increment],
                    bounds: mapData.Limgrave,
                }
            }))
        }
    })
    increment++
    x++
    y++
},3000, origin,x,y,increment)