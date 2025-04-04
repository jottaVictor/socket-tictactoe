import PlayerDataSocket from "#interfaces/player-data-socket";
import Room from "#src/room";
import { WebSocket } from "ws"

export default abstract class GameListner{
    protected rooms: Array<Room>

    constructor(rooms: Array<Room>){
        this.rooms = rooms
    }

    protected isInARoom(ws: WebSocket){
        if((ws as any).playerData?.idRoom)
            return this.rooms[(ws as any).playerData?.idRoom]?.game.isInGame((ws as any).playerData.idPlayer)

        return false
    }

    protected joinPlayerInRoom(ws: WebSocket, aliasPlayer: string, idPlayer: string, idRoom: number){
        const room = this.rooms[idRoom]
        room.join(aliasPlayer, idPlayer)

        this.setPlayerDataSocket(ws, {
            idRoom: idRoom,
            idPlayer: idPlayer,
            aliasPlayer: aliasPlayer ?? null
        })
    }

    protected setPlayerDataSocket(ws: WebSocket, playerData: PlayerDataSocket) {
        (ws as any).playerData = {
            idPlayer: playerData.idPlayer,
            idRoom: playerData,
            aliasPlayer: playerData.aliasPlayer
        }
    }

    protected deletePlayerDataWebSocket(ws: WebSocket){
        delete (ws as any).playerData
    }

    protected exitPlayerOfARoom(ws: WebSocket, idRoom: number){
        if(this.isInARoom(ws))
            this.rooms[idRoom].game.leavePlayer((ws as any).playerData.idPlayer)

        this.deletePlayerDataWebSocket(ws)
    }
}