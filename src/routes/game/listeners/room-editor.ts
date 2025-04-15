import ConnectMessage from "#interfaces/connect-message"
import GenericMesssage from "#interfaces/generic-message"
import Room from '#src/room.js'
import { GenericReturn } from "#utils/interfaces"
import GameListener from "./game-listener.js"
import { WebSocket } from 'ws'
import { generateId } from '#utils/utils.js'
import EditRoomMessage, { PlayerReference } from "#interfaces/edit-room-message.js"
import ListenerReturn, { createListnerReturn } from "#interfaces/listener-return.js"

export default class RoomEditor extends GameListener{    
    public listener(message: GenericMesssage, ws: WebSocket): ListenerReturn{
        const type = "editRoomConfig"

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

        const __EditRoomMessage = (message.data as EditRoomMessage['data'])

        if(!this.isInARoom(ws)){
            returnObj.message = "O jogador não está conectado a um jogo"
            returnObj.code = 1

            return createListnerReturn(type, returnObj)
        }

        const room = this.rooms[(ws as any).playerData.idRoom]
        const idPlayer = (ws as any).playerData.idPlayer

        if(!room.isOwner(idPlayer)){
            returnObj.message = "Você não tem permissão para alterar as configurações da sala"
            returnObj.code = 2

            return createListnerReturn(type, returnObj)
        }

        const getterOpponent = room.game.getIdOpponentById(idPlayer)

        if((__EditRoomMessage.game.firstPlayer !== PlayerReference.self || __EditRoomMessage.room.ownerPlayer !== PlayerReference.self) && !getterOpponent.success){
            returnObj.message = "A configuração não pode ser salva. Você não tem um adversário"
            returnObj.code = 3
            
            return createListnerReturn(type, returnObj)
        }

        room.setConfigGame(__EditRoomMessage.game.timeLimitByPlayer, (__EditRoomMessage.game.firstPlayer === PlayerReference.self ? idPlayer : getterOpponent.data))
        room.setConfigRoom((__EditRoomMessage.room.ownerPlayer === PlayerReference.self ? idPlayer : getterOpponent.data), __EditRoomMessage.room.isPublic, __EditRoomMessage.room.password)

        returnObj.message = "Sala configurada com sucesso"
        returnObj.data = {
            room
        }
        returnObj.code = 4
        returnObj.success = true
        
        return createListnerReturn(type, returnObj)
    }
}