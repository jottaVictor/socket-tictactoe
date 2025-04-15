import Game from "#src/game-logic/game";

export default interface PlayerDataSocket{
    idPlayer: string;
    aliasPlayer: string | null;
    idRoom: string | null;
}