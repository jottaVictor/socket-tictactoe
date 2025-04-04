import Room from '#src/room.js';
export default class ListnerConnectGame {
    constructor(rooms) {
        this.rooms = rooms;
    }
    listner(message) {
        var _a, _b, _c;
        const returnObj = {
            message: '',
            data: null,
            code: null,
            success: false
        };
        if ("connectPlayerInGame" !== message.type) {
            returnObj.code = 0;
            returnObj.success = false;
            return returnObj;
        }
        const connMessage = message.data;
        if ("roomId" in connMessage && connMessage.roomId) {
            const room = this.rooms[connMessage.roomId];
            if (!room) {
                returnObj.message = "Sala não encontrada.";
                returnObj.code = 1;
                return returnObj;
            }
            //prevent join to return an Exception
            if (room.isFull()) {
                returnObj.message = "A sala está cheia.";
                returnObj.code = 2;
                return returnObj;
            }
            if (room.isPublic) {
                room.join(connMessage.aliasPLayer, (_a = connMessage.idPlayer) !== null && _a !== void 0 ? _a : null);
                returnObj.message = "Conectado com successo!";
                returnObj.data = room.game;
                returnObj.code = 3;
                returnObj.success = true;
                return returnObj;
            }
            if (connMessage.roomPassword && room.isValidPassword(connMessage.roomPassword)) {
                room.join(connMessage.aliasPLayer, (_b = connMessage.idPlayer) !== null && _b !== void 0 ? _b : null);
                returnObj.message = "Conectado com successo!";
                returnObj.data = room.game;
                returnObj.code = 4;
                returnObj.success = true;
                return returnObj;
            }
            returnObj.message = "A sala não é pública, senha incorreta.";
            returnObj.data = room.game;
            returnObj.code = 5;
            return returnObj;
        }
        for (const room of this.rooms) {
            console.log(room.isFull());
            if (room.isPublic && !room.isFull()) {
                room.join(connMessage.aliasPLayer, (_c = connMessage.idPlayer) !== null && _c !== void 0 ? _c : null);
                returnObj.message = "Conectado com successo!";
                returnObj.data = room.game;
                returnObj.code = 6;
                returnObj.success = true;
                return returnObj;
            }
        }
        const room = new Room(true);
        this.rooms.push(room);
        returnObj.message = "Nova sala criada!";
        returnObj.data = room.game;
        return returnObj;
    }
}
