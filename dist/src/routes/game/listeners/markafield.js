import GameListener from "./game-listener";
import { createListnerReturn } from "#interfaces/listener-return";
export default class Markafield extends GameListener {
    listener(message, ws) {
        const type = "markafield";
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
        const markData = message.data;
        const room = this.rooms[ws.playerData.idRoom];
        const idPlayer = ws.playerData.idPlayer;
        if (!this.isInARoom(ws)) {
            returnObj.message = "Primeiro você deve se conectar a uma sala para depois jogar.";
            returnObj.code = 1;
            return createListnerReturn(type, returnObj);
        }
        const valid = room.game.markAField(idPlayer, markData.row, markData.column);
        if (valid.success) {
            returnObj.message = "Sucesso ao jogar";
            returnObj.code = 2;
            returnObj.data = room.game.getBoard();
            returnObj.success = true;
            return createListnerReturn(type, returnObj);
        }
        //implement logics
        return createListnerReturn(type, Object.assign(Object.assign({}, valid), { code: 3 }));
    }
}
// const idCurrent = gameRef.current.players[0].isMyTime ? gameRef.current.players[0].id : gameRef.current.players[1].id
// let valid
// if((valid = gameRef.current.markAField(idCurrent, r, c)).success){
//     setBoard([
//         [...gameRef.current.board[0]],
//         [...gameRef.current.board[1]],
//         [...gameRef.current.board[2]]
//     ])
// }
// if(!valid.success || valid.code === 6){
//     log(valid)
// }
