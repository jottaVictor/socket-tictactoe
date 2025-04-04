import Player from './player.js'
import { GenericReturn } from '#utils/interfaces'
import { generateId } from "#utils/utils.js"

type Board = (number | null)[][]

export enum indexPlayer {
    First = 0,
    Second = 1
}

export default class Game{
    private board: Board
    private timeLimitByPlayer: number | null
    private players: [Player | null, Player | null]
    private indexPlayerFirst: indexPlayer
    private winnerID: string | null
    private finish: boolean
    private isOnline: boolean

    constructor(timeLimitByPlayer: number | null, indexPlayerFirst: indexPlayer, isOnline: boolean){
        this.timeLimitByPlayer = timeLimitByPlayer
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.players = [null, null]
        this.indexPlayerFirst = indexPlayerFirst
        this.winnerID = null
        this.finish = false
        this.isOnline = isOnline
    }

    joinInGame(id : string | null, alias: string | null): Player{
        if(this.players[0] !== null && this.players[1] !== null)
            throw new Error("O jogo já está lotado.")

        if(id && this.isInGame(id)){
            throw new Error("O jogador já está no jogo.")
        }

        const newPlayer = new Player(id || generateId(), alias, this.timeLimitByPlayer, null, false)
        
        if(this.players[0] === null){
            this.players[0] = newPlayer
        }else{
            this.players[1] = newPlayer
        }

        return newPlayer
    }

    leavePlayer(idPlayer: string): GenericReturn{
        const returnIndexPlayer = this.getIndexPlayerById(idPlayer)
        if(returnIndexPlayer.code !== 1){
            return {
                message: "O jogador não está no jogo",
                code: 0,
                data: null,
                success: false
            }
        }
        
        this.players[returnIndexPlayer.data] = null

        return {
            message: "Jogador desconectado com sucesso",
            code: 1,
            data: null,
            success: true
        }
    }

    isFull(): boolean{
        return !(this.players[0] === null || this.players[1] === null)
    }

    getIndexPlayerById(id: string): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        if(this.players[0]?.id === id){
            returnObj.data = 0
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }
        
        if(this.players[1]?.id === id){
            returnObj.data = 1
            returnObj.code = 0
            returnObj.success = true
            
            return returnObj
        }

        returnObj.message = "O jogador não faz parte do jogo!"
        returnObj.code = 1
        returnObj.success = false

        return returnObj
    }

    getIndexOpposingPlayerById(id: string): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        if(this.players[0]?.id === id && this.players[1] !== null){
            returnObj.data = 1
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }
        if(this.players[1]?.id === id && this.players[0] !== null){
            returnObj.data = 0
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }

        returnObj.message = "Não foi achado um jogador oponente!"
        returnObj.code = 1
        returnObj.success = false

        return returnObj
    }

    isInGame(id: string): boolean{
        return (this.getIndexPlayerById(id).code !== 1)
    }

    startGame(){
        this.finish = false

        const fPlayer = this.players[this.indexPlayerFirst]!
        fPlayer.isMyTime = true

        if(this.timeLimitByPlayer)
            fPlayer.timeStarted = Date.now()
    }

    markAField(idPlayer: string, row: number, col: number): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        let valid: GenericReturn

        if(this.winnerID || this.finish){
            //dps ajeitar esse acesso ao alias do player vencedor
            returnObj.message = `O jogo já terminou. ${this.winnerID ? `O ganhador foi ${this.players[this.getIndexPlayerById(this.winnerID).data].alias}` : 'Terminou empatado!'}`
            returnObj.code = 0
            returnObj.success = false

            return returnObj
        }

        if(!(valid = this.getIndexPlayerById(idPlayer)).success){
            returnObj = {...returnObj}
            returnObj.code = 1

            return returnObj
        }

        const indexCurrentPlayer = valid.data

        const currentPlayer = this.players[indexCurrentPlayer]!

        if(!(valid = this.getIndexOpposingPlayerById(idPlayer)).success){
            returnObj = {...returnObj}
            returnObj.code = 2

            return returnObj
        }

        const opposingPlayerById = this.players[valid.data]!

        if(!(valid = this.validateField(row, col)).success){
            returnObj = {...valid}
            returnObj.code = 3

            return returnObj
        }
        
        if(!(valid = currentPlayer.play(Date.now())).success){
            if(valid.code === 3){
                this.winnerID = opposingPlayerById.id
                this.finish = true
            }

            returnObj = {...valid}
            returnObj.code = 4

            return returnObj
        }

        opposingPlayerById.isMyTime = true
        opposingPlayerById.timeStarted = Date.now()

        this.board[row][col] = indexCurrentPlayer

        const resultEndGame = this.checkEndGame()

        if(resultEndGame.code === 0){
            this.finish = true
            this.winnerID = resultEndGame.data

            returnObj = {...resultEndGame}
            returnObj.code = 6

            return returnObj
        }

        if(resultEndGame.success){
            this.finish = true
            returnObj = {...resultEndGame}
            returnObj.code = 5

            return resultEndGame
        }

        returnObj.code = 7
        returnObj.success = true

        return returnObj
    }
    
    private validateField(row: number, col: number): GenericReturn {
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        if (this.board[row][col] !== null) {
            returnObj.message = "A posição já foi preenchida, jogue em uma posição válida!"
            returnObj.code = 0
            returnObj.success = false
        }else{
            returnObj.message = ""
            returnObj.code = 1
            returnObj.success = true
        }

        return returnObj
    }

    private checkEndGame(): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            code: 0,
            data: null,
            success: false
        }
        
        let winnerSymbols: (number | null)[] = []
        let hasFieldsToPlay = false

        for(let i = 0; i < 3; i++){
            let currents = [
                this.board[i][i],
                this.board[i][2-i],
                this.board[0][i],
                this.board[1][i],
                this.board[2][i],
                this.board[i][0],
                this.board[i][1],
                this.board[i][2]
            ]


            if(i == 0){
                winnerSymbols = [...currents]
            }

            for(let k = 0; k < 8; k++){
                if(currents[k] === null){
                    hasFieldsToPlay = true
                }

                if(i !== 0 && winnerSymbols[k] !== currents[k]){
                    winnerSymbols[k] = null
                }

                if(i == 2 && winnerSymbols[k] !== null){
                    returnObj.message = `O jogador ${(winnerSymbols[k]+1)} ganhou!`
                    returnObj.code = 0
                    returnObj.data = this.players[winnerSymbols[k]]?.id
                    returnObj.success = true
                    
                    return returnObj
                }
            }
        }

        if(!hasFieldsToPlay){
            returnObj.message = "O jogo deu velha! Não há mais campos para preencher"
            returnObj.code = 1
            returnObj.success = true

            return returnObj
        }

        returnObj.code = 2

        return returnObj
    }
}
