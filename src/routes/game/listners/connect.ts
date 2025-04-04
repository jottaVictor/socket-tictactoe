import ConnectMessage from "#interfaces/connect-message"
import GenericMesssage from "#interfaces/generic-message"
import Room from '#src/room.js'
import { GenericReturn } from "#utils/interfaces"
import GameListner from "./game-listner"
import { WebSocket } from 'ws'

export default class Connect extends GameListner{    
    public listner(message: GenericMesssage, ws: WebSocket): GenericReturn{
        const returnObj: GenericReturn = {
            message: '', 
            data: null,
            code: null,
            success: false            
        }

        if("connectPlayerInGame" !== message.type){
            returnObj.code = 0
            return returnObj
        }

        const connData = (message.data as ConnectMessage['data'])

        if(this.isInARoom(ws)){
            returnObj.message = "O jogador já está conectado a um jogo"
            returnObj.data = {
                idRoom: (ws as any).playerData.idRoom, 
                game: this.rooms[(ws as any).playerData.idRoom].game
            }
            returnObj.code = 1

            return returnObj
        }

        if("idRoom" in connData && connData.idRoom){
            const room = this.rooms[connData.idRoom]

            if (!room) {
                returnObj.message = "Sala não encontrada."
                returnObj.code = 2

                return returnObj
            }

            if(room.isFull()){
                returnObj.message = "A sala está cheia."
                returnObj.code = 3

                return returnObj
            }

            if(room.isPublic){
                this.joinPlayerInRoom(ws, connData.aliasPlayer, connData.idPlayer, connData.idRoom)
                
                returnObj.message = "Conectado com successo!"
                returnObj.data = {
                    idRoom: connData.idRoom,
                    game: room.game
                }
                returnObj.code = 4
                returnObj.success = true

                return returnObj
            }

            if(connData.roomPassword && room.isValidPassword(connData.roomPassword)){
                this.joinPlayerInRoom(ws, connData.aliasPlayer, connData.idPlayer, connData.idRoom)
                
                returnObj.message = "Conectado com successo!"
                returnObj.data = {
                    idRoom: connData.idRoom,
                    game: room.game
                }
                
                room.game
                returnObj.code = 5
                returnObj.success = true

                return returnObj
            }

            returnObj.message = "A sala não é pública, senha incorreta."
            returnObj.data = room.game
            returnObj.code = 6

            return returnObj
        }

        for( const [idRoom, room] of this.rooms.entries() ){
            console.log(room.isFull())
            if(room.isPublic && !room.isFull()){
                this.joinPlayerInRoom(ws, connData.aliasPlayer, connData.idPlayer, idRoom)
                    
                returnObj.message = "Conectado com successo!"
                returnObj.data = returnObj.data = {
                    idRoom: idRoom,
                    game: room.game
                }
                returnObj.code = 7
                returnObj.success = true

                return returnObj
            }
        }

        const room = new Room(true)
        this.rooms.push(room)

        this.joinPlayerInRoom(ws, connData.aliasPlayer, connData.idPlayer, this.rooms.length - 1)

        returnObj.message = "Nova sala criada!"
        
        returnObj.data = {
            idRoom: this.rooms.length - 1,
            game: room.game
        }
        
        return returnObj
    }
}