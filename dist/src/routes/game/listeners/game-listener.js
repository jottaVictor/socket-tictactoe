export default class GameListener {
    constructor(rooms) {
        this.rooms = rooms;
    }
    isInARoom(ws) {
        var _a, _b;
        if ((_a = ws.playerData) === null || _a === void 0 ? void 0 : _a.idRoom)
            return (_b = this.rooms[ws.playerData.idRoom]) === null || _b === void 0 ? void 0 : _b.isInRoom(ws.playerData.idPlayer);
        return false;
    }
    joinPlayerInRoom(ws, idPlayer, aliasPlayer, idRoom) {
        const room = this.rooms[idRoom];
        room.join(idPlayer, aliasPlayer, ws);
        this.setPlayerDataSocket(ws, {
            idRoom: idRoom,
            idPlayer: idPlayer,
            aliasPlayer: aliasPlayer !== null && aliasPlayer !== void 0 ? aliasPlayer : null
        });
    }
    setPlayerDataSocket(ws, playerData) {
        ws.playerData = {
            idPlayer: playerData.idPlayer,
            idRoom: playerData.idRoom,
            aliasPlayer: playerData.aliasPlayer
        };
    }
    deletePlayerDataWebSocket(ws) {
        delete ws.playerData;
    }
    exitPlayerOfARoom(ws) {
        var _a, _b;
        const idRoom = (_b = (_a = ws.playerData) === null || _a === void 0 ? void 0 : _a.idRoom) !== null && _b !== void 0 ? _b : null;
        if (this.isInARoom(ws)) {
            const idRoom = ws.playerData.idRoom;
            this.rooms[idRoom].game.leavePlayer(ws.playerData.idPlayer);
        }
        this.deletePlayerDataWebSocket(ws);
        if (this.rooms[idRoom].isEmpty())
            delete this.rooms[idRoom];
    }
    getRooms() {
        return this.rooms;
    }
}
