import MarkafieldMesssage from "#interfaces/markafield-message"
import GenericMesssage from "#interfaces/generic-message"
import { GenericReturn } from "#utils/interfaces"
import GameListener from "./game-listener.js"
import { WebSocket } from "ws"
import ListenerReturn, { createListnerReturn } from "#interfaces/listener-return.js"

export default class Starter extends GameListener{    
    public listener(message: GenericMesssage, ws: WebSocket): ListenerReturn{
        const type = "startGame"
        const returnObj: GenericReturn = {
            message: '', 
            data: null,
            code: null,
            success: false        
        }

        if(type !== message.type){
            returnObj.code = 0

            return createListnerReturn(type, returnObj)
        }

        
        if(!this.isInARoom(ws)){
            returnObj.message = "Primeiro você deve se conectar a uma sala para depois inicar uma partida."
            returnObj.code = 1
            
            return createListnerReturn(type, returnObj)
        }
        
        const room        = this.rooms[(ws as any).playerData.idRoom]
        const idPlayer    = (ws as any).playerData.idPlayer
        
        if(!room.isOwner(idPlayer)){
            returnObj.message = "Você não tem permissão para iniciar a partida."
            returnObj.code = 2

            return createListnerReturn(type, returnObj)
        }

        const valid = room.game.startGame()

        if(valid.success){
            returnObj.message = "Partida inciada."
            returnObj.code = 3
            returnObj.data =  room.game.getBoard()
            returnObj.success = true

            return createListnerReturn(type, returnObj)
        }

        //implement logics.
        return createListnerReturn(type, {
            ...valid,
            code: 40 + (valid.code || 0)
        })
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