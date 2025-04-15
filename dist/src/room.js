import Game from "#src/game-logic/game.js";
import { createGenericReturn } from "#utils/interfaces.js";
export default class Room {
    constructor(isPublic, password = null) {
        this.isPublic = isPublic;
        this.game = new Game(true);
        this.password = password;
        this.idOwnerPlayer = null;
        this.clients = [];
    }
    isOwner(idPlayer) {
        return idPlayer === this.idOwnerPlayer;
    }
    setConfigRoom(idOwnerPlayer, isPublic, password) {
        this.idOwnerPlayer = idOwnerPlayer;
        this.isPublic = isPublic;
        this.password = password;
    }
    setConfigGame(timeLimitByPlayer, idPlayerFirst) {
        this.game.setConfigGame(timeLimitByPlayer, idPlayerFirst);
    }
    isFull() {
        return this.game.isFull();
    }
    isEmpty() {
        return this.game.isEmpty();
    }
    join(idPlayer, aliasPLayer, ws) {
        this.game.joinInGame(idPlayer, aliasPLayer);
        this.clients.push(ws);
    }
    isInRoom(idPlayer) {
        return this.game.isInGame(idPlayer);
    }
    leavePlayer(idPlayer) {
        return this.game.leavePlayer(idPlayer);
    }
    startGame(idPlayer) {
        const returnObj = createGenericReturn();
        if (!this.isOwner(idPlayer)) {
            returnObj.message = "Você não tem permissão para isso";
            return returnObj;
        }
        const starter = this.game.startGame();
        if (starter.success === false) {
            return Object.assign(Object.assign({}, starter), { code: 1 });
        }
        returnObj.message = "O jogo começou";
        returnObj.data = {
            game: this.game
        };
        returnObj.code = 2;
        returnObj.success = true;
        return returnObj;
    }
    setOwner(idPlayer) {
        this.idOwnerPlayer = idPlayer;
    }
    setIdPlayerFirst(idPlayer) {
        this.game.setIdPlayerFirst(idPlayer);
    }
    isValidPassword(password) {
        return password === this.password || password === null;
    }
    removeClientByIdPlayer(idPlayer) {
        this.clients = this.clients.filter((ws) => { var _a; return ((_a = ws.playerData) === null || _a === void 0 ? void 0 : _a.idPlayer) !== idPlayer; });
    }
    sendMessageForAllClients(message) {
        this.clients.forEach((ws) => { ws.send(JSON.stringify(message)); });
    }
}
