const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

//run npm run test tests/src/connector.test.js 

// this test require the server to be restarted

test("three player connection", (done) => {
    const socket1 = new WebSocket('ws://localhost:5000/game')
    const socket2 = new WebSocket('ws://localhost:5000/game')
    const socket3 = new WebSocket('ws://localhost:5000/game')

    let messagesReceived = 0

    const typeExpected = "connectPlayerInGame"
    const successExpected = true

    socket1.on('open', () => {
        console.log('✅ 00 socket conectado com sucesso')

        socket1.on('message', (message) => {            
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(successExpected)

            messagesReceived++
            checkDone()
        })

        socket1.send(JSON.stringify(
            {
                data: {
                    alias: "player-1",
                    createRoom: true
                },
                type: "connectPlayerInGame"
            }
        ))
    })

    socket2.on('open', () => {
        console.log('✅ 02 socket conectado com sucesso')

        socket2.on('message', (message) => {            
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(successExpected)

            messagesReceived++
            checkDone()
        })

        setTimeout(() => {
            socket2.send(JSON.stringify(
                {
                    data: {
                        alias: "player-2",
                    },
                    type: "connectPlayerInGame"
                }
            ))
        }, 2000)
        
    })

    socket3.on('open', () => {
        console.log('✅ 03 socket conectado com sucesso')

        socket3.on('message', (message) => {            
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(false)

            messagesReceived++
            checkDone()
        })

        setTimeout(() => {
            socket3.send(JSON.stringify(
                {
                    data: {
                        alias: "player-3",
                    },
                    type: "connectPlayerInGame"
                }
            ))
        }, 3000)
        
    })

    function checkDone() {
        if (messagesReceived === 3) {
            socket1.close()
            socket2.close()
            socket3.close()
            done()
        }
    }
})

test("connect in a room with id", (done) => {
    const socket1 = new WebSocket('ws://localhost:5000/game')
    const socket2 = new WebSocket('ws://localhost:5000/game')
    const socket3 = new WebSocket('ws://localhost:5000/game')

    let messagesReceived = 0

    let idRoomConnect

    const typeExpected = "connectPlayerInGame"
    const successExpected = true

    socket1.on('open', () => {
        console.log('✅ 11 socket conectado com sucesso')

        socket1.on('message', (message) => {            
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(successExpected)

            if(_message.success)
                idRoomConnect = _message.data.playerData.idRoom


            messagesReceived++
            checkDone()
        })

        socket1.send(JSON.stringify(
            {
                data: {
                    alias: "player-1",
                    createRoom: true
                },
                type: "connectPlayerInGame"
            }
        ))
    })

    socket2.on('open', () => {
        console.log('✅ 12 socket conectado com sucesso')

        socket2.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(successExpected)

            messagesReceived++
            checkDone()
        })

        socket2.send(JSON.stringify(
            {
                data: {
                    alias: "player-2",
                    idRoom: idRoomConnect
                },
                type: "connectPlayerInGame"
            }
        ))
        
    })

    socket3.on('open', () => {
        console.log('✅ 13 socket conectado com sucesso')

        socket3.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            expect(_message.type).toBe(typeExpected)
            expect(_message.success).toBe(false)

            messagesReceived++
            checkDone()
        })

        socket3.send(JSON.stringify(
            {
                data: {
                    alias: "player-3",
                    idRoom: idRoomConnect
                },
                type: "connectPlayerInGame"
            }
        ))
        
    })

    function checkDone() {
        if (messagesReceived === 3) {
            socket1.close()
            socket2.close()
            socket3.close()
            done()
        }
    }
})