import GenericMessage from "#interfaces/generic-message"
import Game from "#src/game-logic/game.js"
import { GenericReturn, createGenericReturn } from "#utils/interfaces.js"
import { WebSocket } from "ws"

export default class Room{
    public isPublic: boolean
    public game: Game
    private clients: Array<WebSocket>
    private idOwnerPlayer: string | null
    private password: string | null
    private name: string

    constructor(isPublic: boolean, password: string | null = null){
        this.isPublic = isPublic
        this.game = new Game()
        this.password = password
        this.idOwnerPlayer = null
        this.clients = []
        this.name = 'sala online'
    }

    getDataCardRoom(): object{
        return {
            'isPublic': this.isPublic,
            'name': this.name,
            'ownerPlayer': this.getOwnerPlayer().data,
            'countPlayers': this.game.getCountPlayer()
        }
    }

    isOwner(idPlayer: string){
        return idPlayer === this.idOwnerPlayer
    }
    
    setConfigRoom(idOwnerPlayer: string, isPublic: boolean, password: string | null){
        this.idOwnerPlayer = idOwnerPlayer
        this.isPublic = isPublic
        this.password = password
    }
    
    setConfigGame(timeLimitByPlayer: number | null, idPlayerFirst: string){
        this.game.setConfigGame(timeLimitByPlayer, idPlayerFirst)
    }

    isFull(): boolean{
        return this.game.isFull()
    }

    isEmpty(): boolean{
        return this.game.isEmpty()
    }
    
    join(idPlayer: string, aliasPLayer: string | null, ws: WebSocket){
        this.game.joinInGame(idPlayer, aliasPLayer)
        this.clients.push(ws)
    }
    
    removeClientByIdPlayer(idPlayer: string) {
        const index = this.clients.findIndex((item) => {
            return (item as any).playerData.idPlayer === idPlayer;
        });
    
        if (index !== -1) {
            this.clients.splice(index, 1)
        }
    }

    isInRoom(idPlayer: string){
        return this.game.isInGame(idPlayer)
    }

    leavePlayer(idPlayer: string): GenericReturn{
        return this.game.leavePlayer(idPlayer) 
    }

    startGame(idPlayer: string): GenericReturn{
        const returnObj = createGenericReturn()

        if(!this.isOwner(idPlayer)){
            returnObj.message = "Você não tem permissão para isso"
            
            return returnObj
        }

        const starter = this.game.startGame()

        if(starter.success === false){
            return {
                ...starter,
                code: 1
            }
        }

        returnObj.message = "O jogo começou"
        returnObj.data = {
            game: this.game
        }
        returnObj.code = 2
        returnObj.success = true

        return returnObj
    }

    setOwner(idPlayer: string){
        this.idOwnerPlayer = idPlayer
    }

    getOwnerPlayer(){
        let returnObj = createGenericReturn()
        if(!this.idOwnerPlayer){
            returnObj.code = 0
        }else{
            returnObj = this.game.getPlayerById(this.idOwnerPlayer)
            returnObj.code! += 10
        }
        return returnObj
    }

    setIdPlayerFirst(idPlayer: string){
        this.game.setIdPlayerFirst(idPlayer)
    }

    isValidPassword(password: string): boolean{
        return password === this.password || password === null
    }

    sendMessageForAllClients(message: GenericMessage){
        this.clients.forEach( (ws) => { ws.send(JSON.stringify(message))})
    }
}