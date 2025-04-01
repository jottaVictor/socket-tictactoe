import Player from './player';
import { generateId } from '@utils/utils';
export var indexPlayer;
(function (indexPlayer) {
    indexPlayer[indexPlayer["First"] = 0] = "First";
    indexPlayer[indexPlayer["Second"] = 1] = "Second";
})(indexPlayer || (indexPlayer = {}));
export default class Game {
    constructor(timeLimitByPlayer, indexPlayerFirst, isOnline) {
        this.timeLimitByPlayer = timeLimitByPlayer;
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.players = [null, null];
        this.indexPlayerFirst = indexPlayerFirst;
        this.winnerID = null;
        this.finish = false;
        this.isOnline = isOnline;
    }
    joinInGame(alias, id) {
        if (this.players[0] !== null && this.players[1] !== null)
            throw new Error("O jogo já está lotado.");
        const newPlayer = new Player(id || generateId(), alias, this.timeLimitByPlayer, null, false);
        if (this.players[0] === null) {
            this.players[0] = newPlayer;
        }
        else {
            this.players[1] = newPlayer;
        }
        return newPlayer;
    }
    isFull() {
        return (this.players[0] === null || this.players[1] === null);
    }
    getIndexPlayerById(id) {
        var _a, _b;
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            sucess: false
        };
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) === id) {
            returnObj.data = 0;
            returnObj.code = 0;
            returnObj.sucess = true;
            return returnObj;
        }
        if (((_b = this.players[1]) === null || _b === void 0 ? void 0 : _b.id) === id) {
            returnObj.data = 1;
            returnObj.code = 0;
            returnObj.sucess = true;
            return returnObj;
        }
        returnObj.message = "O jogador não faz parte do jogo!";
        returnObj.code = 1;
        returnObj.sucess = false;
        return returnObj;
    }
    getIndexOpposingPlayerById(id) {
        var _a, _b;
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            sucess: false
        };
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) === id && this.players[1] !== null) {
            returnObj.data = 1;
            returnObj.code = 0;
            returnObj.sucess = true;
            return returnObj;
        }
        if (((_b = this.players[1]) === null || _b === void 0 ? void 0 : _b.id) === id && this.players[0] !== null) {
            returnObj.data = 0;
            returnObj.code = 0;
            returnObj.sucess = true;
            return returnObj;
        }
        returnObj.message = "Não foi achado um jogador oponente!";
        returnObj.code = 1;
        returnObj.sucess = false;
        return returnObj;
    }
    startGame() {
        this.finish = false;
        const fPlayer = this.players[this.indexPlayerFirst];
        fPlayer.isMyTime = true;
        if (this.timeLimitByPlayer)
            fPlayer.timeStarted = Date.now();
    }
    markAField(idPlayer, row, col) {
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            sucess: false
        };
        let valid;
        if (this.winnerID || this.finish) {
            //dps ajeitar esse acesso ao alias do player vencedor
            returnObj.message = `O jogo já terminou. ${this.winnerID ? `O ganhador foi ${this.players[this.getIndexPlayerById(this.winnerID).data].alias}` : 'Terminou empatado!'}`;
            returnObj.code = 0;
            returnObj.sucess = false;
            return returnObj;
        }
        if (!(valid = this.getIndexPlayerById(idPlayer)).sucess) {
            returnObj = Object.assign({}, returnObj);
            returnObj.code = 1;
            return returnObj;
        }
        const indexCurrentPlayer = valid.data;
        const currentPlayer = this.players[indexCurrentPlayer];
        if (!(valid = this.getIndexOpposingPlayerById(idPlayer)).sucess) {
            returnObj = Object.assign({}, returnObj);
            returnObj.code = 2;
            return returnObj;
        }
        const opposingPlayerById = this.players[valid.data];
        if (!(valid = this.validateField(row, col)).sucess) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 3;
            return returnObj;
        }
        if (!(valid = currentPlayer.play(Date.now())).sucess) {
            if (valid.code === 3) {
                this.winnerID = opposingPlayerById.id;
                this.finish = true;
            }
            returnObj = Object.assign({}, valid);
            returnObj.code = 4;
            return returnObj;
        }
        opposingPlayerById.isMyTime = true;
        opposingPlayerById.timeStarted = Date.now();
        this.board[row][col] = indexCurrentPlayer;
        const resultEndGame = this.checkEndGame();
        if (resultEndGame.code === 0) {
            this.finish = true;
            this.winnerID = resultEndGame.data;
            returnObj = Object.assign({}, resultEndGame);
            returnObj.code = 6;
            return returnObj;
        }
        if (resultEndGame.sucess) {
            this.finish = true;
            returnObj = Object.assign({}, resultEndGame);
            returnObj.code = 5;
            return resultEndGame;
        }
        returnObj.code = 7;
        returnObj.sucess = true;
        return returnObj;
    }
    validateField(row, col) {
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            sucess: false
        };
        if (this.board[row][col] !== null) {
            returnObj.message = "A posição já foi preenchida, jogue em uma posição válida!";
            returnObj.code = 0;
            returnObj.sucess = false;
        }
        else {
            returnObj.message = "";
            returnObj.code = 1;
            returnObj.sucess = true;
        }
        return returnObj;
    }
    checkEndGame() {
        var _a;
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            sucess: false
        };
        let winnerSymbols = [];
        let hasFieldsToPlay = false;
        for (let i = 0; i < 3; i++) {
            let currents = [
                this.board[i][i],
                this.board[i][2 - i],
                this.board[0][i],
                this.board[1][i],
                this.board[2][i],
                this.board[i][0],
                this.board[i][1],
                this.board[i][2]
            ];
            if (i == 0) {
                winnerSymbols = [...currents];
            }
            for (let k = 0; k < 8; k++) {
                if (currents[k] === null) {
                    hasFieldsToPlay = true;
                }
                if (i !== 0 && winnerSymbols[k] !== currents[k]) {
                    winnerSymbols[k] = null;
                }
                if (i == 2 && winnerSymbols[k] !== null) {
                    returnObj.message = `O jogador ${(winnerSymbols[k] + 1)} ganhou!`;
                    returnObj.code = 0;
                    returnObj.data = (_a = this.players[winnerSymbols[k]]) === null || _a === void 0 ? void 0 : _a.id;
                    returnObj.sucess = true;
                    return returnObj;
                }
            }
        }
        if (!hasFieldsToPlay) {
            returnObj.message = "O jogo deu velha! Não há mais campos para preencher";
            returnObj.code = 1;
            returnObj.sucess = true;
            return returnObj;
        }
        returnObj.code = 2;
        return returnObj;
    }
}
