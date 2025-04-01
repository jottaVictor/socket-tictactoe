import GenericMessage from "./interfaces/generic-message"
import Connector from "./connector.js"
import Room from "./interfaces/room"
import { WebSocketServer, WebSocket } from 'ws';

export default class RemoteRule{
    private rooms: Array<Room> = []
    private Connector: Connector
    private wss: WebSocketServer
    private port: number

    constructor(port){
        this.rooms = []
        this.Connector = new Connector(this.rooms)
        this.port = port
        this.wss = new WebSocketServer({ port: port });
        
        this.wss.on('connection', (ws) => {
            ws.on("error", console.error)
        
            //when that receive a message run this
            ws.on('message', (message) => {
                //return all messages to all clients connected
                //remover depois
                this.wss.clients.forEach((ws) => ws.send(message.toString()))

                try{
                    console.log(message.toString())
                    this.listner(JSON.parse(message.toString()), ws)
                }catch (error){
                    console.error("Erro ao processar mensagem recebida:", error);
                }
            })
        
            console.log("New client connected")
        })

        console.log(`WebSocket Server running on ws://localhost:${port}`);
    }

    public listner(message: GenericMessage, ws: WebSocket){
        const resultConn = this.Connector.listner(message)
        if(resultConn.code !== 0){
            ws.send(JSON.stringify(message))
            console.log("Enviado resposta ao cliente")
        }
    }
}