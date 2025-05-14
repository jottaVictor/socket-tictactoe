import GenericMessage from "#interfaces/generic-message"
import Connector from "./listeners/connector.js"
import Room from '#src/room.js'
import { WebSocketServer, WebSocket } from 'ws';
import { measureMemory } from "vm";
import Disconnector from "./listeners/disconnector.js";
import RoomEditor from "./listeners/room-editor.js";
import Markafield from "./listeners/markafield.js";
import Starter from "./listeners/starter.js";
import RoomsGetter from "./listeners/rooms-getter.js";

export default class WebSocketGameHandler{
    private rooms: Record<string, Room>
    private __Connector: Connector
    private __Disconnector: Disconnector
    private __RoomEditor: RoomEditor
    private __Markafield: Markafield
    private __Starter: Starter
    private __RoomsGetter: RoomsGetter

    constructor(){
        this.rooms = {
            'para': new Room(true, null),
            '1': new Room(true, null),
            '300': new Room(true, null),
            '3': new Room(true, null)
        }
        this.__Connector = new Connector(this.rooms)
        this.__Disconnector = new Disconnector(this.rooms)
        this.__RoomEditor = new RoomEditor(this.rooms)
        this.__Markafield = new Markafield(this.rooms)
        this.__Starter = new Starter(this.rooms)
        this.__RoomsGetter = new RoomsGetter(this.rooms)
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

        const connector   = this.__Connector.listener(message, ws)
        const editor      = this.__RoomEditor.listener(message, ws)
        const marker      = this.__Markafield.listener(message, ws)
        const starter     = this.__Starter.listener(message, ws)
        const roomsGetter = this.__RoomsGetter.listener(message, ws)

        if(connector.code !== 0){
            console.log('Enviada', connector)

            if(connector.success)
                this.sendForAllConnectedInTheSameRoom(connector, (ws as any).playerData.idRoom)
            else
                ws.send(JSON.stringify(connector))
        }

        if(editor.code !== 0){
            console.log('Enviada', editor)

            if(editor.success)
                this.sendForAllConnectedInTheSameRoom(editor, (ws as any).playerData.idRoom)
            else
                ws.send(JSON.stringify(editor))
        }

        if(marker.code !== 0){
            console.log('Enviada', marker)
            if(marker.success)
                this.sendForAllConnectedInTheSameRoom(marker, (ws as any).playerData.idRoom)
            else
                ws.send(JSON.stringify(marker))
        }

        if(starter.code !== 0){
            console.log('Enviada', starter)
            if(starter.success)
                this.sendForAllConnectedInTheSameRoom(starter, (ws as any).playerData.idRoom)
            else
                ws.send(JSON.stringify(starter))
        }

        if(roomsGetter.code !== 0){
            console.log('Enviada', roomsGetter)
            ws.send(JSON.stringify(roomsGetter))
        }
    }

    public listenerClose(ws: WebSocket){
        const disconnector = this.__Disconnector.listener(ws)
        if((ws as any).playerData?.idRoom)
            this.sendForAllConnectedInTheSameRoom(disconnector, (ws as any).playerData.idRoom)
    }

    public sendForAllConnectedInTheSameRoom(message: GenericMessage, idRoom: string){
        if(this.rooms[idRoom])
            this.rooms[idRoom].sendMessageForAllClients(message)
    }
}