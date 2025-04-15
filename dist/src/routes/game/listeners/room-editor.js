import GameListener from "./game-listener.js";
import { PlayerReference } from "#interfaces/edit-room-message.js";
import { createListnerReturn } from "#interfaces/listener-return.js";
export default class RoomEditor extends GameListener {
    listener(message, ws) {
        const type = "editRoomConfig";
        const returnObj = {
            message: '',
            data: null,
            code: null,
            success: false
        };
        if (type !== message.type) {
            returnObj.code = 0;
            return createListnerReturn(type, returnObj);
        }
        const __EditRoomMessage = message.data;
        if (!this.isInARoom(ws)) {
            returnObj.message = "O jogador não está conectado a um jogo";
            returnObj.code = 1;
            return createListnerReturn(type, returnObj);
        }
        const room = this.rooms[ws.playerData.idRoom];
        const idPlayer = ws.playerData.idPlayer;
        if (!room.isOwner(idPlayer)) {
            returnObj.message = "Você não tem permissão para alterar as configurações da sala";
            returnObj.code = 2;
            return createListnerReturn(type, returnObj);
        }
        const getterOpponent = room.game.getIdOpponentById(idPlayer);
        if (__EditRoomMessage.game.firstPlayer === PlayerReference.opponent && !getterOpponent.success) {
            returnObj.message = "Você não tem um adversário";
            returnObj.code = 3;
            return createListnerReturn(type, returnObj);
        }
        room.setConfigGame(__EditRoomMessage.game.timeLimitByPlayer, (__EditRoomMessage.game.firstPlayer === PlayerReference.self ? idPlayer : getterOpponent.data));
        room.setConfigRoom(__EditRoomMessage.room.idOwnerPlayer, __EditRoomMessage.room.isPublic, __EditRoomMessage.room.password);
        returnObj.message = "Sala configurada com sucesso";
        returnObj.data = room.game;
        returnObj.code = 4;
        returnObj.success = true;
        return createListnerReturn(type, returnObj);
    }
}
