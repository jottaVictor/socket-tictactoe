import Game from "#src/game-logic/game.js";
export default class Room {
    constructor(isPublic, password = '') {
        this.isPublic = isPublic;
        this.game = new Game(null, 0, true);
        this.password = password;
    }
    setConfigGame(timeLimitByPlayer, indexPlayerFirst) {
        this.game = new Game(timeLimitByPlayer, indexPlayerFirst, true);
    }
    isFull() {
        return this.game.isFull();
    }
    join(aliasPLayer, idPlayer) {
        this.game.joinInGame(aliasPLayer, idPlayer);
    }
    isValidPassword(password) {
        return true;
    }
}
