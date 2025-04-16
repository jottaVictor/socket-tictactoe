const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

//run npm run test tests/listeners/markafield.test.js 
test('player try start but is not connected', (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")
    
    socket1.on('open', () => {
        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe("startGame")
            expect(_message.success).toBe(false)
            expect(_message.code).toBe(1)
            expect(_message.message).toBe("Primeiro você deve se conectar a uma sala para depois inicar uma partida.")
            
            done()
        })

        socket1.send(JSON.stringify({
            type: 'startGame'
        }))
    })
})

test('player try start but dont has permission', (done) => {
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

            idRoomConnect = _message.data.playerData.idRoom
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
                    type: 'startGame'
                }))
            }

            if(_message.type === "startGame"){
                expect(_message.success).toBe(false)
                expect(_message.code).toBe(2)
                expect(_message.message).toBe("Você não tem permissão para iniciar a partida.")
                
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