import GenericMesssage from "#interfaces/generic-message"
import Room from '#src/room.js'
import { GenericReturn } from "#utils/interfaces"
import GameListener from "./game-listener.js"
import { WebSocket } from 'ws'
import ListenerReturn, { createListnerReturn } from "#interfaces/listener-return.js"

export default class RoomsGetter extends GameListener{    
    public listener(message: GenericMesssage, ws: WebSocket): ListenerReturn{
        const type = "getRooms"

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

        returnObj.data = {rooms: Object.fromEntries(
            Object.entries(this.rooms).map(
                ([key, room]: [string, Room]) => [key, room.getDataCardRoom()]
            )
        )}
        returnObj.success = true
        
        return createListnerReturn(type, returnObj)
    }
}