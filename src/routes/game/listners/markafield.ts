import MarkafieldMesssage from "#interfaces/markafield-message"
import GenericMesssage from "#interfaces/generic-message"
import { GenericReturn } from "#utils/interfaces"
import GameListner from "./game-listner"
import { WebSocket } from "ws"

export default class Markafield extends GameListner{    
    public listner(message: GenericMesssage, ws: WebSocket): GenericReturn{
        const returnObj: GenericReturn = {
            message: '', 
            data: null,
            code: null,
            success: false            
        }

        if("markfield" !== message.type){
            returnObj.code = 0
            return returnObj
        }

        const markData = (message.data as MarkafieldMesssage['data'])
        const room        = this.rooms[(ws as any).playerData.idRoom]
        const idPlayer    = (ws as any).playerData.idPlayer

        if(!this.isInARoom(ws)){
            returnObj.message = "Primeiro você deve se conectar a uma sala para depois jogar."
            returnObj.code = 1

            return returnObj
        }

        const valid = room.game.markAField(idPlayer, markData.row, markData.column)


        //implement logics
        return returnObj
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