const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

//run npm run test tests/listeners/markafield.test.js 
test('player try mark a field but is not connected', (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")

    const doneTest = () => {
        socket1.close()
        done()
    }
    
    socket1.on('open', () => {
        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe("markafield")
            expect(_message.success).toBe(false)
            expect(_message.code).toBe(1)
            expect(_message.message).toBe("Primeiro você deve se conectar a uma sala para depois jogar.")
            
            doneTest()
        })

        socket1.send(JSON.stringify({
            type: 'markafield',
            data: {
                idPlayer: 'HELLOWORD',
                row: 0,
                column: 0
            }
        }))
    })
})

test('player try mark a field but the game didnt start', (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")
    const socket2 = new WebSocket("ws://localhost:5000/game")

    const doneTest = () => {
        socket1.close()
        socket2.close()
        done()
    }

    let idRoomConnect

    socket1.on('open', () => {
        socket1.on('message', (mesage) => {
            let _message = JSON.parse(mesage.toString())

            if(_message.type === "connectPlayerInGame"){
                idRoomConnect = _message.data.playerData.idRoom
            }

            expect(_message.type).not.toBe("markafield")
        })

        socket1.send(JSON.stringify({
            type: 'connectPlayerInGame',
            data: {
                alias: 'player-1',
                createRoom: true
            }
        }))
    })

    socket2.on('open', () => {
        socket2.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === "connectPlayerInGame"){
                socket2.playerData = {..._message.data.playerData}
                socket2.send(JSON.stringify({
                    type: 'markafield',
                    data: {
                        idPlayer: socket2.playerData.idPlayer,
                        row: 0,
                        column: 0
                    }
                }))
            }

            if(_message.type === "markafield"){
                expect(_message.success).toBe(false)
                expect(_message.code).toBe(30)
                expect(_message.message).toBe("O jogo ainda não começou.")
                doneTest()
            }
        })

        socket2.send(JSON.stringify({
            type: 'connectPlayerInGame',
            data: {
                alias: 'player-2',
                idRoom: idRoomConnect
            }
        }))
    })
})