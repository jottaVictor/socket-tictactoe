import { GenericReturn } from '@utils/interfaces'
import PError from '@utils/pError'
export default class Player{
    readonly id: string
    readonly alias: string | null
    public timeLimit: number | null
    public timeStarted: number | null
    public isMyTime: boolean

    constructor(id: string, alias: string | null, timeLimit: number | null, timeStarted: number | null, isMyTime: boolean){
        this.id = id
        this.alias = alias
        this.timeLimit = timeLimit
        this.timeStarted = timeStarted
        this.isMyTime = isMyTime
    }

    play(timePlayed: number | null): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: null,
            sucess: false            
        }
        let valid: GenericReturn;
        
        valid = this.validateTurn()
        
        if(!valid.sucess){
            returnObj.message = valid.message
            returnObj.code = 0
            returnObj.sucess = false

            return returnObj
        }

        this.isMyTime = false;

        if (this.timeLimit === null){
            returnObj.code = 1
            returnObj.sucess = true

            return returnObj
        }

        valid = this.validateTimePlayed(timePlayed);

        if(!valid.sucess){
            returnObj = {...valid}
            returnObj.code = 2
            
            return returnObj
        }

        valid = this.updateTimeLimit(timePlayed);
        
        if(!valid.sucess){
            returnObj = {...valid}
            returnObj.code = 3

            return returnObj
        }

        returnObj.code = 4
        returnObj.sucess = true

        return returnObj
    }

    private validateTurn(): GenericReturn {
        let returnObj: GenericReturn = {
            message: '',
            code: 0,
            data: null,
            sucess: false
        }

        if (!this.isMyTime) {
            returnObj.message = `Não é a vez do jogador ${this.alias ?? ''}!`
            returnObj.code = 0
            returnObj.sucess = false
        }else{
            returnObj.code = 1
            returnObj.sucess = true
        }

        return returnObj
    }

    private validateTimePlayed(timePlayed: number | null): GenericReturn {
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: null,
            sucess: false            
        }

        if (timePlayed === null || this.timeStarted === null) {
            returnObj.message = "Erro de lógica na passagem dos tempos"
            returnObj.code = 0
            returnObj.sucess = false
        }else{
            returnObj.code = 1
            returnObj.sucess = true
        }

        return returnObj
    }

    private updateTimeLimit(timePlayed: number): GenericReturn {
        let returnObj: GenericReturn = {
            message: '',
            code: 0,
            data: null,
            sucess: false
        }

        const timeSpent = timePlayed - this.timeStarted!;
        this.timeLimit! -= timeSpent;

        if (this.timeLimit! < 0) {
            returnObj.message = "Tempo limite gasto."
            returnObj.code = 0
            returnObj.sucess = false
        }else{
            returnObj.code = 1
            returnObj.sucess = true
        }
        
        return returnObj
    }
}