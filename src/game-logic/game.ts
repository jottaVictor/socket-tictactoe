import Player from './player.js'
import { GenericReturn, createGenericReturn } from '#utils/interfaces.js'

type Board = (number | null)[][]

export default class Game{
    private board: Board
    private timeLimitByPlayer: number | null
    private players: [Player | null, Player | null]
    private idPlayerFirst: string | null
    private winnerID: string | null
    private started: boolean
    private finish: boolean

    constructor(){
        this.timeLimitByPlayer = null
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
        this.players = [null, null]
        this.idPlayerFirst = null
        this.winnerID = null
        this.started = false
        this.finish = false
    }

    setConfigGame(timeLimitByPlayer: number | null, idPlayerFirst: string){
        this.timeLimitByPlayer = timeLimitByPlayer
        this.idPlayerFirst = idPlayerFirst
    }

    setIdPlayerFirst(idPlayer: string){
        this.idPlayerFirst = idPlayer
    }

    getBoard(){
        return this.board
    }

    joinInGame(idPlayer : string, alias: string | null): Player{
        if(this.players[0] !== null && this.players[1] !== null)
            throw new Error("O jogo já está lotado.")

        if(idPlayer && this.isInGame(idPlayer)){
            throw new Error("O jogador já está no jogo.")
        }

        const newPlayer = new Player(idPlayer, alias, this.timeLimitByPlayer, null, false)
        
        if(this.players[0] === null){
            this.players[0] = newPlayer
        }else{
            this.players[1] = newPlayer
        }

        return newPlayer
    }

    leavePlayer(idPlayer: string): GenericReturn{
        const returnIndexPlayer = this.getIndexPlayerById(idPlayer)
        if(returnIndexPlayer.code === 1){
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

    isEmpty(): boolean{
        return this.players[0] === null && this.players[1] === null
    }

    getCountPlayer(): number{
        let countPlayer = 0
        this.players.map((item) => {
            if(item)
                countPlayer++
        })

        return countPlayer
    }

    getIndexPlayerById(idPlayer: string): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }
        
        if(this.players[0]?.id === idPlayer){
            returnObj.data = 0
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }
        
        if(this.players[1]?.id === idPlayer){
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

    getIndexOpponentPlayerById(idPlayer: string): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        if(this.players[0]?.id === idPlayer && this.players[1] !== null){
            returnObj.data = 1
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }
        if(this.players[1]?.id === idPlayer && this.players[0] !== null){
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

    getPlayerById(idPlayer: string){
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        if(this.players[0]?.id === idPlayer){
            returnObj.data = this.players[0]
            returnObj.code = 0
            returnObj.success = true

            return returnObj
        }
        
        if(this.players[1]?.id === idPlayer){
            returnObj.data = this.players[1]
            returnObj.code = 0
            returnObj.success = true
            
            return returnObj
        }

        returnObj.message = "O jogador não faz parte do jogo!"
        returnObj.code = 1
        returnObj.success = false

        return returnObj
    }

    getIdOpponentById(idPlayer: string): GenericReturn{
        const returnObj = createGenericReturn()

        if(!this.isInGame(idPlayer)){
            returnObj.message = "O jogador não está no jogo"
            return returnObj
        }

        if(!this.isFull()){
            returnObj.message = "Sem adversários no jogo"
            returnObj.code = 1
            return returnObj
        }

        if(this.players[0]?.id !== idPlayer){
            returnObj.data = this.players[0]!.id
            returnObj.code = 2
            returnObj.success = true
            return  returnObj
        }

        returnObj.data = this.players[1]!.id
        returnObj.code = 3
        returnObj.success = true

        return returnObj
    }

    getOpponentPlayerById(idPlayer: string): GenericReturn{
        const returnObj = createGenericReturn()

        const valid = this.getIdOpponentById(idPlayer)
        
        if(!valid.success){
            return valid
        }

        returnObj.data = this.getPlayerById(valid.data)
        returnObj.code = 1
        returnObj.success = true
        return returnObj
    }

    isInGame(idPlayer: string): boolean{
        return (this.getIndexPlayerById(idPlayer).code !== 1)
    }

    startGame(): GenericReturn{
        const returnObj = createGenericReturn()

        if(this.started && !this.finish){
            returnObj.message = "O jogo ainda está acontecendo."
            
            return returnObj
        }

        if(!this.isFull()){
            returnObj.message = "O jogo deve ter dois jogadores para começar."
            returnObj.code = 1
            
            return returnObj
        }

        if(!this.idPlayerFirst){
            returnObj.message = "Ainda não foi definido quem será o primeiro a jogar."
            returnObj.code = 2

            return returnObj
        }


        const returnGetterPlayer = this.getPlayerById(this.idPlayerFirst)

        if(returnGetterPlayer.code === 1){
            returnObj.message = "O primeiro jogador não foi definido"
            returnObj.code = 3
            
            return returnObj
        }

        this.started = true
        this.finish = false
        this.winnerID = null
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null))
        returnGetterPlayer.data.isMyTime = true
        returnGetterPlayer.data.timeLimit = this.timeLimitByPlayer

        const opponentPlayer = this.getOpponentPlayerById(this.idPlayerFirst).data
        opponentPlayer.timeLimit = this.timeLimitByPlayer
        opponentPlayer.isMyTime = false

        if(this.timeLimitByPlayer)
            returnGetterPlayer.data.timeStarted = Date.now()

        returnObj.message = ""
        returnObj.code = 4
        returnObj.success = true

        return returnObj
    }

    markAField(idPlayer: string, row: number, col: number): GenericReturn{
        let returnObj: GenericReturn = {
            message: '',
            data: null,
            code: 0,
            success: false
        }

        let valid: GenericReturn

        if(!this.started){
            returnObj.message = "O jogo ainda não começou."
            returnObj.code = 0
            returnObj.success = false
            return returnObj
        }

        if(this.winnerID || this.finish){
            returnObj.message = "O jogo já terminou."
            returnObj.code = 1
            returnObj.success = false

            return returnObj
        }

        if(!(valid = this.getIndexPlayerById(idPlayer)).success){
            returnObj = {...returnObj}
            returnObj.code = 2

            return returnObj
        }

        const indexCurrentPlayer = valid.data

        const currentPlayer = this.players[indexCurrentPlayer]!

        if(!(valid = this.getIndexOpponentPlayerById(idPlayer)).success){
            returnObj = {...returnObj}
            returnObj.code = 3

            return returnObj
        }

        const opponentPlayerById = this.players[valid.data]!

        if(!(valid = this.validateField(row, col)).success){
            returnObj = {...valid}
            returnObj.code = 4

            return returnObj
        }
        
        if(!(valid = currentPlayer.play(Date.now())).success){
            if(valid.code === 3){
                this.winnerID = opponentPlayerById.id
                this.finish = true
            }

            returnObj = {...valid}
            returnObj.code = 6

            return returnObj
        }

        opponentPlayerById.isMyTime = true
        opponentPlayerById.timeStarted = Date.now()

        this.board[row][col] = indexCurrentPlayer

        const resultEndGame = this.checkEndGame()

        
        if(resultEndGame.code === 0){
            this.finish = true
            this.winnerID = resultEndGame.data

            returnObj = {...resultEndGame}
            returnObj.code = 7

            return returnObj
        }

        if(resultEndGame.success){
            this.finish = true
            returnObj = {...resultEndGame}
            returnObj.code = 8

            return resultEndGame
        }

        returnObj.code = 9
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
                    returnObj.message = `O jogador ${((winnerSymbols[k] as number)+1)} ganhou!`
                    returnObj.code = 0
                    returnObj.data = this.players[(winnerSymbols[k] as number)]?.id
                    returnObj.success = true
                    
                    return returnObj
                }
            }
        }

        if(!hasFieldsToPlay){
            returnObj.message = "O jogo deu velha! Não há mais campos para preencher."
            returnObj.code = 1
            returnObj.success = true

            return returnObj
        }

        returnObj.code = 2

        return returnObj
    }
}
