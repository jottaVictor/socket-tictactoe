import Game, { indexPlayer } from "../game-logic/game"
import GameConfig from "./game-config"

export default class Room{
    public isPublic: boolean
    private game: Game
    private password: string | null

    constructor(isPublic: boolean, password = ''){
        this.isPublic = isPublic
        this.game = new Game(null, 0, true)
        this.password = password
    }

    setConfigGame(timeLimitByPlayer: number | null, indexPlayerFirst: indexPlayer){
        this.game = new Game(timeLimitByPlayer , indexPlayerFirst, true)
    }

    isFull(): boolean{
        return this.game.isFull()
    }

    join(aliasPLayer: string | null, idPlayer: string | null){
        this.game.joinInGame(aliasPLayer, idPlayer)
    }

    getGame(): Game{
        return this.game
    }

    validPassword(password: string): boolean{
        return true
    }
}