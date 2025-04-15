import GameListener from "./game-listener.js";
export default class Disconnector extends GameListener {
    listener(ws) {
        var _a;
        if (((_a = ws.playerData) === null || _a === void 0 ? void 0 : _a.idRoom) !== undefined) {
            const idRoom = ws.playerData.idRoom;
            const idPlayer = ws.playerData.idPlayer;
            console.log("tentando desconectar o jogador " + ws.playerData.idPlayer + " da sala " + idRoom);
            console.dir('Listando salas: ', this.rooms);
            this.rooms[idRoom].removeClientByIdPlayer(idPlayer);
            const leaver = this.rooms[idRoom].leavePlayer(idPlayer);
            console.log('Leaver: ', leaver);
            if (this.rooms[idRoom].isEmpty()) {
                delete this.rooms[idRoom];
                console.log(`Sala ${idRoom} excluida por falta de Player. Restam agora ${Object.keys(this.rooms).length} salas`);
            }
        }
    }
}
