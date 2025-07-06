class WebSocketService {

    constructor(url='ws://localhost:8080'){
        this.url = url;
        this.ws = null;
        this.message = [];
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
            try {
                const data = JSON.parse(e.data);
                
                
                
                
                
                this.message.push(data);
                //Handle the message directly here if needed
            } catch(error) {
                console.error("Parse error:", error);
            }
        });
        this.ws.addEventListener('error', (error) => {
            console.error(`WebSocket Error:`, error);
        });
    }

    passMessage(){
        return message
        // if(this.ws && this.ws.readyState == WebSocket.OPEN){
        //     console.log(`Sending: ${message}`);
        //     this.ws.send(JSON.stringify(message));
        // } else {
        //     console.error('Web Socket is not connected');
        // }
    }
    disconnect(){
        if(this.ws){
            console.log("Disconnecting from socker Server");
            this.ws.close();
            this.ws=null;
        }
    }

}
//I want this as a constant 
const socketService = new WebSocketService();
export default socketService