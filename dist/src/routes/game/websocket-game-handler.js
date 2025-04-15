import Connector from "./listeners/connector.js";
import Disconnector from "./listeners/disconnector.js";
import RoomEditor from "./listeners/room-editor.js";
export default class WebSocketGameHandler {
    constructor(wss) {
        this.rooms = {};
        this.__Connector = new Connector(this.rooms);
        this.__Disconnector = new Disconnector(this.rooms);
        this.__RoomEditor = new RoomEditor(this.rooms);
        this.wss = wss;
    }
    handler(ws, req) {
        console.log("New client connected");
        ws.on("error", console.error);
        //when receive a message run this
        ws.on('message', (message) => {
            try {
                this.listener(JSON.parse(message.toString()), ws);
            }
            catch (error) {
                console.error("Erro ao processar mensagem recebida:", error);
            }
        });
        ws.on("close", () => {
            this.listenerClose(ws);
        });
    }
    listener(message, ws) {
        console.log('Recebida', message);
        const resultConn = this.__Connector.listener(message, ws);
        const resultEdit = this.__RoomEditor.listener(message, ws);
        if (resultConn.code !== 0) {
            ws.send(JSON.stringify(resultConn));
            console.log('Enviada', resultConn);
        }
        if (resultEdit.code !== 0) {
            console.log('Enviada', resultEdit);
            if (resultEdit.code === 3) {
                this.sendForAllConnectedInTheSameRoom(resultEdit, ws.playerData.idRoom);
            }
            else {
                ws.send(JSON.stringify(resultEdit));
            }
        }
    }
    listenerClose(ws) {
        this.__Disconnector.listener(ws);
    }
    sendForAllConnectedInTheSameRoom(message, idRoom) {
        this.rooms[idRoom].sendMessageForAllClients(message);
    }
}
