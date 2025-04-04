import DisconnectMessage from "#interfaces/disconnect-message"
import GenericMesssage from "#interfaces/generic-message"
import { GenericReturn } from "#utils/interfaces"
import GameListner from "./game-listner"
import { WebSocket } from "ws"

export default class Disconnect extends GameListner{    
    public listner(message: GenericMesssage, ws: WebSocket): GenericReturn{
        const returnObj: GenericReturn = {
            message: '', 
            data: null,
            code: null,
            success: false            
        }

        if("disconnectPlayer" !== message.type){
            returnObj.code = 0
            return returnObj
        }

        const disconnData = (message.data as DisconnectMessage['data'])
        const room = this.rooms[disconnData.idRoom]

        if(!this.isInARoom(ws)){
            returnObj.message = "O jogador não está em uma sala."
            returnObj.code = 1

            return returnObj
        }

        if (!room) {
            returnObj.message = "Sala não encontrada."
            returnObj.code = 2

            return returnObj
        }

        this.exitPlayerOfARoom(ws, disconnData.idRoom)

        returnObj.message = "Disconectado com sucesso."
        returnObj.code = 3
        return returnObj
    }
}