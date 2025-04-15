import ConnectMessage from "#interfaces/connect-message"
import GenericMesssage from "#interfaces/generic-message"
import Room from '#src/room.js'
import GameListener from "./game-listener.js"
import { WebSocket } from 'ws'
import { generateId } from '#utils/utils.js'

export default class Disconnector extends GameListener{
    public listener(ws: WebSocket){
        if((ws as any).playerData?.idRoom !== undefined){
            
            const idRoom = (ws as any).playerData.idRoom
            const idPlayer = (ws as any).playerData.idPlayer
            
            console.log("tentando desconectar o jogador " + (ws as any).playerData.idPlayer + " da sala " + idRoom)
            console.dir('Listando salas: ', this.rooms)
        
            this.rooms[idRoom].removeClientByIdPlayer(idPlayer)
            
            const leaver = this.rooms[idRoom].leavePlayer(idPlayer)
            console.log('Leaver: ', leaver)

                if(this.rooms[idRoom].isEmpty()){
                    delete this.rooms[idRoom]
                    console.log(`Sala ${idRoom} excluida por falta de Player. Restam agora ${Object.keys(this.rooms).length} salas`);
                }
        }            
    }
}