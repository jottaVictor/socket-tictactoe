import PlayerDataSocket from "#interfaces/player-data-socket";
import Room from "#src/room";
import { WebSocket } from "ws"

export default abstract class GameListener{
    protected rooms: Record<string, Room>

    constructor(rooms: Record<string, Room>){
        this.rooms = rooms
    }

    protected isInARoom(ws: WebSocket){
        if((ws as any).playerData?.idRoom)
            return this.rooms[(ws as any).playerData.idRoom]?.isInRoom((ws as any).playerData.idPlayer)

        return false
    }

    protected joinPlayerInRoom(ws: WebSocket, idPlayer: string, aliasPlayer: string, idRoom: string){
        const room = this.rooms[idRoom]
        room.join(idPlayer, aliasPlayer, ws)

        this.setPlayerDataSocket(ws, {
            idRoom: idRoom,
            idPlayer: idPlayer,
            aliasPlayer: aliasPlayer ?? null
        })
    }

    protected setPlayerDataSocket(ws: WebSocket, playerData: PlayerDataSocket) {
        (ws as any).playerData = {
            idPlayer: playerData.idPlayer,
            idRoom: playerData.idRoom,
            aliasPlayer: playerData.aliasPlayer
        }
    }

    protected deletePlayerDataWebSocket(ws: WebSocket){
        delete (ws as any).playerData
    }

    protected exitPlayerOfARoom(ws: WebSocket){
        const idRoom = (ws as any).playerData?.idRoom ?? null

        if(this.isInARoom(ws)){
            const idRoom = (ws as any).playerData.idRoom
            this.rooms[idRoom].game.leavePlayer((ws as any).playerData.idPlayer)
        }

        this.deletePlayerDataWebSocket(ws)

        if(this.rooms[idRoom].isEmpty())
            delete this.rooms[idRoom]
    }

    public getRooms(){
        return this.rooms
    }
}