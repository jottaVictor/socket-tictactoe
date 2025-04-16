import ConnectMessage from "#interfaces/connect-message"
import GenericMesssage from "#interfaces/generic-message"
import Room from '#src/room.js'
import { GenericReturn } from "#utils/interfaces"
import GameListener from "./game-listener.js"
import { WebSocket } from 'ws'
import { generateId } from '#utils/utils.js'
import ListenerReturn, { createListnerReturn } from "#interfaces/listener-return.js"

//to do: generate id only if the user dont have an account

export default class Connector extends GameListener{    
    public listener(message: GenericMesssage, ws: WebSocket): ListenerReturn{
        const type = "connectPlayerInGame"
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

        const connData = (message.data as ConnectMessage['data'])

        if(this.isInARoom(ws)){
            returnObj.message = "O jogador já está conectado a um jogo"
            returnObj.data = {
                game: this.rooms[(ws as any).playerData.idRoom].game
            }
            returnObj.code = 1

            return createListnerReturn(type, returnObj)
        }

        if(connData && "idRoom" in connData){
            const room = this.rooms[connData.idRoom!]

            if (!room) {
                returnObj.message = "Sala não encontrada."
                returnObj.code = 2

                return createListnerReturn(type, returnObj)
            }

            if(room.isFull()){
                returnObj.message = "A sala está cheia."
                returnObj.code = 3

                return createListnerReturn(type, returnObj)
            }

            if(room.isPublic){
                this.joinPlayerInRoom(ws,  generateId(), connData.aliasPlayer, connData.idRoom!)
                
                returnObj.message = "Conectado com successo!"
                returnObj.data = {
                    game: room.game,
                    playerData: (ws as any).playerData
                }
                returnObj.code = 4
                returnObj.success = true

                return createListnerReturn(type, returnObj)
            }

            if(connData.roomPassword && room.isValidPassword(connData.roomPassword)){
                this.joinPlayerInRoom(ws, generateId(), connData.aliasPlayer, connData.idRoom!)
                
                returnObj.message = "Conectado com successo!"
                returnObj.data = {
                    game: room.game,
                    playerData: (ws as any).playerData
                }
                
                room.game
                returnObj.code = 5
                returnObj.success = true

                return createListnerReturn(type, returnObj)
            }

            returnObj.message = "A sala não é pública, senha incorreta."
            returnObj.code = 6

            return createListnerReturn(type, returnObj)
        }

        if(connData.createRoom){
            //after the idPlayer will not be generated in the connection
            const idPlayer = generateId()
            const room = new Room(true, null)
            const idRoom = 'room' + generateId()
            this.rooms[idRoom] = room

            this.joinPlayerInRoom(ws, idPlayer, connData.aliasPlayer, idRoom)
            room.setOwner(idPlayer)
            room.setIdPlayerFirst(idPlayer)

            returnObj.message = "Nova sala criada!"
            
            returnObj.data = {
                game: room.game,
                playerData: (ws as any).playerData
            }

            returnObj.success = true
            returnObj.code = 7
            
            return createListnerReturn(type, returnObj)
        }

        for( const [idRoom, room] of Object.entries(this.rooms) ){
            if(room.isPublic && !room.isFull()){
                this.joinPlayerInRoom(ws, generateId(), connData.aliasPlayer, idRoom)
                    
                returnObj.message = "Conectado com successo!"
                returnObj.data = returnObj.data = {
                    game: room.game,
                    playerData: (ws as any).playerData
                }
                returnObj.code = 8
                returnObj.success = true

                return createListnerReturn(type, returnObj)
            }
        }

        returnObj.message = "Sem salas públicas disponíveis"
        returnObj.code = 9

        return createListnerReturn(type, returnObj)
    }
}