import Player from './player.js';
import { createGenericReturn } from '#utils/interfaces.js';
export var indexPlayer;
(function (indexPlayer) {
    indexPlayer[indexPlayer["First"] = 0] = "First";
    indexPlayer[indexPlayer["Second"] = 1] = "Second";
})(indexPlayer || (indexPlayer = {}));
export default class Game {
    constructor(isOnline) {
        this.timeLimitByPlayer = null;
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.players = [null, null];
        this.idPlayerFirst = null;
        this.winnerID = null;
        this.started = false;
        this.finish = false;
        this.isOnline = isOnline;
    }
    setConfigGame(timeLimitByPlayer, idPlayerFirst) {
        this.timeLimitByPlayer = timeLimitByPlayer;
        this.idPlayerFirst = idPlayerFirst;
    }
    setIdPlayerFirst(idPlayer) {
        this.idPlayerFirst = idPlayer;
    }
    getBoard() {
        return this.board;
    }
    joinInGame(idPlayer, alias) {
        if (this.players[0] !== null && this.players[1] !== null)
            throw new Error("O jogo já está lotado.");
        if (idPlayer && this.isInGame(idPlayer)) {
            throw new Error("O jogador já está no jogo.");
        }
        const newPlayer = new Player(idPlayer, alias, this.timeLimitByPlayer, null, false);
        if (this.players[0] === null) {
            this.players[0] = newPlayer;
        }
        else {
            this.players[1] = newPlayer;
        }
        return newPlayer;
    }
    leavePlayer(idPlayer) {
        const returnIndexPlayer = this.getIndexPlayerById(idPlayer);
        if (returnIndexPlayer.code === 1) {
            return {
                message: "O jogador não está no jogo",
                code: 0,
                data: null,
                success: false
            };
        }
        this.players[returnIndexPlayer.data] = null;
        return {
            message: "Jogador desconectado com sucesso",
            code: 1,
            data: null,
            success: true
        };
    }
    isFull() {
        return !(this.players[0] === null || this.players[1] === null);
    }
    isEmpty() {
        return this.players[0] === null && this.players[1] === null;
    }
    getIndexPlayerById(idPlayer) {
        var _a, _b;
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            success: false
        };
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) === idPlayer) {
            returnObj.data = 0;
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        if (((_b = this.players[1]) === null || _b === void 0 ? void 0 : _b.id) === idPlayer) {
            returnObj.data = 1;
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        returnObj.message = "O jogador não faz parte do jogo!";
        returnObj.code = 1;
        returnObj.success = false;
        return returnObj;
    }
    getIndexOpposingPlayerById(idPlayer) {
        var _a, _b;
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            success: false
        };
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) === idPlayer && this.players[1] !== null) {
            returnObj.data = 1;
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        if (((_b = this.players[1]) === null || _b === void 0 ? void 0 : _b.id) === idPlayer && this.players[0] !== null) {
            returnObj.data = 0;
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        returnObj.message = "Não foi achado um jogador oponente!";
        returnObj.code = 1;
        returnObj.success = false;
        return returnObj;
    }
    getPlayerById(idPlayer) {
        var _a, _b;
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            success: false
        };
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) === idPlayer) {
            returnObj.data = this.players[0];
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        if (((_b = this.players[1]) === null || _b === void 0 ? void 0 : _b.id) === idPlayer) {
            returnObj.data = this.players[1];
            returnObj.code = 0;
            returnObj.success = true;
            return returnObj;
        }
        returnObj.message = "O jogador não faz parte do jogo!";
        returnObj.code = 1;
        returnObj.success = false;
        return returnObj;
    }
    getIdOpponentById(idPlayer) {
        var _a;
        const returnObj = createGenericReturn();
        if (this.isInGame(idPlayer)) {
            returnObj.message = "O jogador não está no jogo";
            return returnObj;
        }
        if (!this.isFull()) {
            returnObj.message = "Sem adversários no jogo";
            returnObj.code = 1;
            return returnObj;
        }
        if (((_a = this.players[0]) === null || _a === void 0 ? void 0 : _a.id) !== idPlayer) {
            returnObj.data = this.players[0].id;
            returnObj.code = 2;
            returnObj.success = true;
            return returnObj;
        }
        returnObj.data = this.players[1].id;
        returnObj.code = 3;
        returnObj.success = true;
        return returnObj;
    }
    isInGame(idPlayer) {
        return (this.getIndexPlayerById(idPlayer).code !== 1);
    }
    startGame() {
        const returnObj = createGenericReturn();
        if (this.started) {
            returnObj.message = "O jogo ainda está acontecendo.";
            return returnObj;
        }
        if (!this.isFull()) {
            returnObj.message = "O jogo deve ter dois jogadores para começar.";
            returnObj.code = 1;
            return returnObj;
        }
        if (!this.idPlayerFirst) {
            returnObj.message = "Ainda não foi definido quem será o primeiro a jogar.";
            returnObj.code = 2;
            return returnObj;
        }
        const returnGetterPlayer = this.getPlayerById(this.idPlayerFirst);
        if (returnGetterPlayer.code === 1) {
            returnObj.message = "O primeiro jogador não foi definido";
            returnObj.code = 3;
            return returnObj;
        }
        this.started = true;
        this.finish = false;
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        returnGetterPlayer.data.isMyTime = true;
        if (this.timeLimitByPlayer)
            returnGetterPlayer.data.timeStarted = Date.now();
        returnObj.message = "";
        returnObj.code = 4;
        returnObj.success = true;
        return returnObj;
    }
    markAField(idPlayer, row, col) {
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            success: false
        };
        let valid;
        if (this.winnerID || this.finish) {
            //dps ajeitar esse acesso ao alias do player vencedor
            returnObj.message = "O jogo já terminou.";
            returnObj.code = 0;
            returnObj.success = false;
            return returnObj;
        }
        if (!(valid = this.getIndexPlayerById(idPlayer)).success) {
            returnObj = Object.assign({}, returnObj);
            returnObj.code = 1;
            return returnObj;
        }
        const indexCurrentPlayer = valid.data;
        const currentPlayer = this.players[indexCurrentPlayer];
        if (!(valid = this.getIndexOpposingPlayerById(idPlayer)).success) {
            returnObj = Object.assign({}, returnObj);
            returnObj.code = 2;
            return returnObj;
        }
        const opposingPlayerById = this.players[valid.data];
        if (!(valid = this.validateField(row, col)).success) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 3;
            return returnObj;
        }
        if (!(valid = currentPlayer.play(Date.now())).success) {
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
        if (resultEndGame.success) {
            this.finish = true;
            returnObj = Object.assign({}, resultEndGame);
            returnObj.code = 5;
            return resultEndGame;
        }
        returnObj.code = 7;
        returnObj.success = true;
        return returnObj;
    }
    validateField(row, col) {
        let returnObj = {
            message: '',
            data: null,
            code: 0,
            success: false
        };
        if (this.board[row][col] !== null) {
            returnObj.message = "A posição já foi preenchida, jogue em uma posição válida!";
            returnObj.code = 0;
            returnObj.success = false;
        }
        else {
            returnObj.message = "";
            returnObj.code = 1;
            returnObj.success = true;
        }
        return returnObj;
    }
    checkEndGame() {
        var _a;
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            success: false
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
                    returnObj.success = true;
                    return returnObj;
                }
            }
        }
        if (!hasFieldsToPlay) {
            returnObj.message = "O jogo deu velha! Não há mais campos para preencher";
            returnObj.code = 1;
            returnObj.success = true;
            return returnObj;
        }
        returnObj.code = 2;
        return returnObj;
    }
}
