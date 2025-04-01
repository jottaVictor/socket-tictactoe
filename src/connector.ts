import ConnectMessage from "./interfaces/connect-message"
import GenericMesssage from "./interfaces/generic-message"
import Room from "./interfaces/room"
import { GenericReturn } from "./utils/interfaces"

export default class Connector{
    private rooms: Array<Room>

    constructor(rooms: Array<Room>){
        this.rooms = rooms
    }
    
    public listner(message: GenericMesssage): GenericReturn{
        const returnObj: GenericReturn = {
            message: '', 
            data: null,
            code: null,
            sucess: false            
        }

        if("connectPlayerInGame" !== message.type){
            returnObj.code = 0
            returnObj.sucess = false
            return returnObj
        }

        const connMessage = (message.data as ConnectMessage['data'])

        if("roomId" in connMessage && connMessage.roomId){
            const room = this.rooms[connMessage.roomId]

            if (!room) {
                returnObj.message = "Sala não encontrada."
                returnObj.code = 1

                return returnObj
            }

            //prevent join to return an Exception
            if(room.isFull()){
                returnObj.message = "A sala está cheia."
                returnObj.code = 2

                return returnObj
            }

            if(room.isPublic){
                room.join(connMessage.aliasPLayer, connMessage.idPlayer ?? null )
                
                returnObj.message = "Conectado com sucesso!"
                returnObj.data = room.getGame()
                returnObj.code = 3
                returnObj.sucess = true

                return returnObj
            }

            if(connMessage.roomPassword && room.validPassword(connMessage.roomPassword)){
                room.join(connMessage.aliasPLayer, connMessage.idPlayer ?? null )
                
                returnObj.message = "Conectado com sucesso!"
                returnObj.data = room.getGame()
                returnObj.code = 4
                returnObj.sucess = true

                return returnObj
            }

            returnObj.message = "A sala não é pública, senha incorreta."
            returnObj.data = room.getGame()
            returnObj.code = 5

            return returnObj
        }

        for( const room of this.rooms ){
            if(room.isPublic && !room.isFull()){
                room.join(connMessage.aliasPLayer, connMessage.idPlayer ?? null )
                    
                returnObj.message = "Conectado com sucesso!"
                returnObj.data = room.getGame()
                returnObj.code = 6
                returnObj.sucess = true

                return returnObj
            }
        }
        
        return returnObj
    }
}