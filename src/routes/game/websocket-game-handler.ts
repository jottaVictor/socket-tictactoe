import GenericMessage from "#interfaces/generic-message"
import Connector from "./listners/connect.js"
import Room from '#src/room.js'
import { WebSocketServer, WebSocket } from 'ws';

export default class WebSocketGameHandler{
    private rooms: Array<Room> = []
    private Connector: Connector
    private wss: WebSocketServer

    constructor(wss: WebSocketServer){
        this.rooms = []
        this.Connector = new Connector(this.rooms)
        this.wss = wss
    }

    public handler(ws: WebSocket, req: any){
        console.log("New client connected")

        ws.on("error", console.error)
        
        //when that receive a message run this
        ws.on('message', (message) => {
            try{
                this.listner(JSON.parse(message.toString()), ws)
            }catch (error){
                console.error("Erro ao processar mensagem recebida:", error);
            }
        })
    }

    public listner(message: GenericMessage, ws: WebSocket){
        const resultConn = this.Connector.listner(message, ws)
        if(resultConn.code !== 0){
            ws.send(JSON.stringify(resultConn))
            console.log("Enviado resposta ao cliente")
        }
    }
}