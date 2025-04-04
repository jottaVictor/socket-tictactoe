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
            success: false
        };
        let valid;
        valid = this.validateTurn();
        if (!valid.success) {
            returnObj.message = valid.message;
            returnObj.code = 0;
            returnObj.success = false;
            return returnObj;
        }
        this.isMyTime = false;
        if (this.timeLimit === null) {
            returnObj.code = 1;
            returnObj.success = true;
            return returnObj;
        }
        valid = this.validateTimePlayed(timePlayed);
        if (!valid.success) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 2;
            return returnObj;
        }
        valid = this.updateTimeLimit(timePlayed);
        if (!valid.success) {
            returnObj = Object.assign({}, valid);
            returnObj.code = 3;
            return returnObj;
        }
        returnObj.code = 4;
        returnObj.success = true;
        return returnObj;
    }
    validateTurn() {
        var _a;
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            success: false
        };
        if (!this.isMyTime) {
            returnObj.message = `Não é a vez do jogador ${(_a = this.alias) !== null && _a !== void 0 ? _a : ''}!`;
            returnObj.code = 0;
            returnObj.success = false;
        }
        else {
            returnObj.code = 1;
            returnObj.success = true;
        }
        return returnObj;
    }
    validateTimePlayed(timePlayed) {
        let returnObj = {
            message: '',
            data: null,
            code: null,
            success: false
        };
        if (timePlayed === null || this.timeStarted === null) {
            returnObj.message = "Erro de lógica na passagem dos tempos";
            returnObj.code = 0;
            returnObj.success = false;
        }
        else {
            returnObj.code = 1;
            returnObj.success = true;
        }
        return returnObj;
    }
    updateTimeLimit(timePlayed) {
        let returnObj = {
            message: '',
            code: 0,
            data: null,
            success: false
        };
        const timeSpent = timePlayed - this.timeStarted;
        this.timeLimit -= timeSpent;
        if (this.timeLimit < 0) {
            returnObj.message = "Tempo limite gasto.";
            returnObj.code = 0;
            returnObj.success = false;
        }
        else {
            returnObj.code = 1;
            returnObj.success = true;
        }
        return returnObj;
    }
}
