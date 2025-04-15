import GenericMessage from "#interfaces/generic-message"
import Connector from "./listeners/connector.js"
import Room from '#src/room.js'
import { WebSocketServer, WebSocket } from 'ws';
import { measureMemory } from "vm";
import Disconnector from "./listeners/disconnector.js";
import RoomEditor from "./listeners/room-editor.js";

export default class WebSocketGameHandler{
    private rooms: Record<string, Room>
    private __Connector: Connector
    private __Disconnector: Disconnector
    private __RoomEditor: RoomEditor
    private wss: WebSocketServer

    constructor(wss: WebSocketServer){
        this.rooms = {}
        this.__Connector = new Connector(this.rooms)
        this.__Disconnector = new Disconnector(this.rooms)
        this.__RoomEditor = new RoomEditor(this.rooms)
        this.wss = wss
    }

    public handler(ws: WebSocket, req: any){
        console.log("New client connected")

        ws.on("error", console.error)
        
        //when receive a message run this
        ws.on('message', (message) => {
            try{
                this.listener(JSON.parse(message.toString()), ws)
            }catch (error){
                console.error("Erro ao processar mensagem recebida:", error);
            }
        })
        
        ws.on("close", () => {
            this.listenerClose(ws)
        })
    }

    public listener(message: GenericMessage, ws: WebSocket){
        console.log('Recebida', message)

        const resultConn = this.__Connector.listener(message, ws)
        const resultEdit = this.__RoomEditor.listener(message, ws)
        if(resultConn.code !== 0){
            ws.send(JSON.stringify(resultConn))
            console.log('Enviada', resultConn)
        }

        if(resultEdit.code !== 0){
            console.log('Enviada', resultEdit)

            if(resultEdit.code === 3){
                this.sendForAllConnectedInTheSameRoom(resultEdit, (ws as any).playerData.idRoom)
            }else{
                ws.send(JSON.stringify(resultEdit))
            }
        }
    }

    public listenerClose(ws: WebSocket){
        this.__Disconnector.listener(ws)
    }

    public sendForAllConnectedInTheSameRoom(message: GenericMessage, idRoom: string){
        this.rooms[idRoom].sendMessageForAllClients(message)
    }
}