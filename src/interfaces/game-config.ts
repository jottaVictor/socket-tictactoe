import { indexPlayer } from "../game-logic/game";

export default interface GameConfig{
    timeLimitByPlayer: number | null,
    indexPlayerFirst: indexPlayer,
    isOnline: boolean
}