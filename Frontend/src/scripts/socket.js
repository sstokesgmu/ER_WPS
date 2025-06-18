class WebSocketService {
    constructor(url='ws://localhost:8080'){
        this.url = url;
        this.ws = null;
        //? What are message Handlers
        //this.messageHandlers = new Set();
    }

    //Handles the service stuff 
    connect() {
        console.log(this.ws)
        // Prevent multiple connections
        if (this.ws || this.isConnecting) {
            console.log(this.ws);
            console.log('WebSocket is already connected or connecting');
            return;
        }

        this.isConnecting = true;
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener('open', ()=>{
            console.log('=== Connected to Server ===');
        });

        this.ws.addEventListener('message', (e) => {
            console.log(this.ws);
            console.log(this.ws.readyState)
            try {
                const data = JSON.parse(e.data);
                console.log(`Recieved from server:`, data);
                //Handle the message directly here if needed
            } catch(error) {
                console.error("Parse error:", error);
            }
        });
        this.ws.addEventListener('close', ()=>{
            console.log(`=== Disconnected from Server ===`);
        });

        this.ws.addEventListener('error', (error) => {
            console.error(`WebSocket Error:`, error);
        });
    }

    passMessage(message){
        if(this.ws && this.ws.readyState == WebSocket.OPEN){
            console.log(`Sending: ${message}`);
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('Web Socket is not connected');
        }
    }
    disconnect(){
        if(this.ws){
            this.ws.close();
            this.ws=null;
        }
    }


}
const socketService = new WebSocketService();
export default socketService