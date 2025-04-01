export default class Player {
    constructor(id, alias, timeLimit, timeStarted, isMyTime) {
        this.id = id;
        this.alias = alias;
        this.timeLimit = timeLimit;
        this.timeStarted = timeStarted;
        this.isMyTime = isMyTime;
    }
    play(timePlayed) {
        let returnObj = {
            message: '',
            data: null,
            code: null,
            sucess: false
        };
        let valid;
        valid = this.validateTurn();
        if (!valid.sucess) {
            returnObj.message = valid.message;
            returnObj.code = 0;
            returnObj.sucess = false;
            return returnObj;
        }
        this.isMyTime = false;
        if (this.timeLimit === null) {
            returnObj.code = 1;
            returnObj.sucess = true;
            return returnObj;
        }
        valid = this.validateTimePlayed(timePlayed);
        if (!valid.sucess) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 2;
            return returnObj;
        }
        valid = this.updateTimeLimit(timePlayed);
        if (!valid.sucess) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 3;
            return returnObj;
        }
        returnObj.code = 4;
        returnObj.sucess = true;
        return returnObj;
    }
    validateTurn() {
        var _a;
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            sucess: false
        };
        if (!this.isMyTime) {
            returnObj.message = `Não é a vez do jogador ${(_a = this.alias) !== null && _a !== void 0 ? _a : ''}!`;
            returnObj.code = 0;
            returnObj.sucess = false;
        }
        else {
            returnObj.code = 1;
            returnObj.sucess = true;
        }
        return returnObj;
    }
    validateTimePlayed(timePlayed) {
        let returnObj = {
            message: '',
            data: null,
            code: null,
            sucess: false
        };
        if (timePlayed === null || this.timeStarted === null) {
            returnObj.message = "Erro de lógica na passagem dos tempos";
            returnObj.code = 0;
            returnObj.sucess = false;
        }
        else {
            returnObj.code = 1;
            returnObj.sucess = true;
        }
        return returnObj;
    }
    updateTimeLimit(timePlayed) {
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            sucess: false
        };
        const timeSpent = timePlayed - this.timeStarted;
        this.timeLimit -= timeSpent;
        if (this.timeLimit < 0) {
            returnObj.message = "Tempo limite gasto.";
            returnObj.code = 0;
            returnObj.sucess = false;
        }
        else {
            returnObj.code = 1;
            returnObj.sucess = true;
        }
        return returnObj;
    }
}
