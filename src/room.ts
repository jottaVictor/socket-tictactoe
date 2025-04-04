import Game, { indexPlayer } from "#src/game-logic/game.js"
import GameConfig from "#interfaces/game-config"
import { GenericReturn } from "#utils/interfaces"

export default class Room{
    public isPublic: boolean
    public game: Game
    private password: string | null
    private clients: Array<WebSocket>

    constructor(isPublic: boolean, password = ''){
        this.isPublic = isPublic
        this.game = new Game(null, 0, true)
        this.password = password
        this.clients = []
    }

    setConfigGame(timeLimitByPlayer: number | null, indexPlayerFirst: indexPlayer){
        this.game = new Game(timeLimitByPlayer , indexPlayerFirst, true)
    }

    isFull(): boolean{
        return this.game.isFull()
    }

    join(aliasPLayer: string | null, idPlayer: string){
        this.game.joinInGame(aliasPLayer, idPlayer)
    }

    leave(idPlayer: string){
        this.game.leavePlayer(idPlayer)
    }

    isValidPassword(password: string): boolean{
        return true
    }

    leavePlayer(idPlayer: string): GenericReturn{
        return this.game.leavePlayer(idPlayer)
    }
}