import Connector from "./listners/listner-connect-game.js";
export default class WebSocketGameHandler {
    constructor(wss) {
        this.rooms = [];
        this.rooms = [];
        this.Connector = new Connector(this.rooms);
        this.wss = wss;
    }
    handler(ws, req) {
        console.log("New client connected");
        ws.on("error", console.error);
        //when that receive a message run this
        ws.on('message', (message) => {
            //return all messages to all clients connected
            //remover depois
            try {
                this.listner(JSON.parse(message.toString()), ws);
            }
            catch (error) {
                console.error("Erro ao processar mensagem recebida:", error);
            }
        });
    }
    listner(message, ws) {
        const resultConn = this.Connector.listner(message);
        if (resultConn.code !== 0) {
            ws.send(JSON.stringify(resultConn));
            console.log("Enviado resposta ao cliente");
        }
    }
}
