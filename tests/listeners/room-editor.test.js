const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

//run npm run test tests/listeners/room-editor.test.js 

test("a player create a room and edit it so that others dont enter", (done) => {
    const socket1 = new WebSocket('ws://localhost:5000/game')
    const socket2 = new WebSocket('ws://localhost:5000/game')
    const socket3 = new WebSocket('ws://localhost:5000/game')

    let idRoomConnect
    
    function doneTest(){
        socket1.close()
        socket2.close()
        socket3.close()

        done()
    }

    socket1.on('open', () => {
        console.log('✅ 01 socket conectado com sucesso')

        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === 'connectPlayerInGame' && _message.success)
                idRoomConnect = _message.data.playerData.idRoom

            if(_message.type !== "editRoomConfig")
                return

            expect(_message.success).toBe(true)
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

        socket1.send(JSON.stringify(
            {
                type: "editRoomConfig",
                data: {
                    game: {
                        timeLimitByPlayer: null,
                        firstPlayer: "self"
                    },
                    room: {
                        ownerPlayer: "self",
                        isPublic: false,
                        password: "1234"
                    }
                }
            }
        ))
        
    })

    socket2.on('open', () => {
        console.log('✅ 02 socket conectado com sucesso')

        socket2.on('message', (message) => {
            let _message = JSON.parse(message.toString())
            
            if(_message.type !== "connectPlayerInGame")
                return

            expect(_message.success).toBe(false)
        })
        
        setTimeout( () => {
            socket2.send(JSON.stringify(
                {
                    data: {
                        alias: "player-2",
                        idRoom: idRoomConnect
                    },
                    type: "connectPlayerInGame"
                }
            ))
        }, 1500)
    })

    socket3.on('open', () => {
        console.log('✅ 03 socket conectado com sucesso')

        socket3.on('message', (message) => {
            let _message = JSON.parse(message.toString())
            
            if(_message.type !== "connectPlayerInGame")
                return

            expect(_message.success).toBe(true)

            doneTest()
        })
        
        setTimeout( () => {
            socket3.send(JSON.stringify(
                {
                    data: {
                        alias: "player-3",
                        idRoom: idRoomConnect,
                        roomPassword: "1234"
                    },
                    type: "connectPlayerInGame"
                }
            ))
        }, 1500)
    })
})


test("player try edit a room without connect", (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")

    socket1.on('open', () => {
        console.log('✅ 11 socket conectado com sucesso')
        
        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            expect(_message.success).toBe(false)
            expect(_message.message).toBe("O jogador não está conectado a um jogo")

            socket1.close()
            done()
        })

        socket1.send(JSON.stringify({
            type: "editRoomConfig",
                data: {
                    game: {
                        timeLimitByPlayer: null,
                        firstPlayer: "self"
                    },
                    room: {
                        ownerPlayer: "self",
                        isPublic: false,
                        password: "1234"
                    }
                }
        }))
    })

    
})

test("player try edit without permission", (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")
    const socket2 = new WebSocket("ws://localhost:5000/game")

    const doneTest = ()=> {
        socket1.close()
        socket2.close()
        done()
    }

    let idRoomConnect

    socket1.on('open', () => {
        console.log('✅ 21 socket conectado com sucesso')
        
        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())
            
            expect(_message.success).toBe(true)
            idRoomConnect = _message.data.playerData.idRoom
        })

        socket1.send(JSON.stringify({
            type: "connectPlayerInGame",
            data: {
                alias: "player-1",
                createRoom: true
            }
        }))
    })

    socket2.on('open', () => {
        console.log('✅ 22 socket conectado com sucesso')

        socket2.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === 'connectPlayerInGame'){
                expect(_message.success).toBe(true)
            }else{
                expect(_message.type).toBe("editRoomConfig")
                expect(_message.success).toBe(false)
                expect(_message.message).toBe("Você não tem permissão para alterar as configurações da sala")

                doneTest()
            }
        })

        setTimeout(() => {
            socket2.send(JSON.stringify({
                type: "connectPlayerInGame",
                data: { 
                    alias: "player-2",
                    idRoom: idRoomConnect
                }
            }))

            socket2.send(JSON.stringify({
                type: "editRoomConfig",
                    data: {
                        game: {
                            timeLimitByPlayer: null,
                            firstPlayer: "self"
                        },
                        room: {
                            ownerPlayer: "self",
                            isPublic: false,
                            password: "1234"
                        }
                    }
            }))
        }, 300)
    })
})

test("players try edit without opponent, but passing owner and firstToPlay 'opponent'", (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")
    const socket2 = new WebSocket("ws://localhost:5000/game")

    const doneTest = ()=> {
        socket1.close()
        socket2.close()
        done()
    }

    socket1.on('open', () => {
        console.log('✅ 32 socket conectado com sucesso')

        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === 'connectPlayerInGame'){
                expect(_message.success).toBe(true)
            }else{
                expect(_message.type).toBe("editRoomConfig")
                expect(_message.success).toBe(false)
                expect(_message.message).toBe("A configuração não pode ser salva. Você não tem um adversário")
            }
        })

        socket1.send(JSON.stringify({
            type: "connectPlayerInGame",
            data: { 
                alias: "player-1",
                createRoom: true
            }
        }))

        socket1.send(JSON.stringify({
            type: "editRoomConfig",
                data: {
                    game: {
                        timeLimitByPlayer: null,
                        firstPlayer: "opponent"
                    },
                    room: {
                        ownerPlayer: "self",
                        isPublic: false,
                        password: "1234"
                    }
                }
        }))
    })

    socket2.on('open', () => {
        console.log('✅ 32 socket conectado com sucesso')

        socket2.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === 'connectPlayerInGame'){
                expect(_message.success).toBe(true)
            }else{
                expect(_message.type).toBe("editRoomConfig")
                expect(_message.success).toBe(false)
                expect(_message.message).toBe("A configuração não pode ser salva. Você não tem um adversário")

                doneTest()
            }
        })

        socket2.send(JSON.stringify({
            type: "connectPlayerInGame",
            data: { 
                alias: "player-1",
                createRoom: true
            }
        }))

        socket2.send(JSON.stringify({
            type: "editRoomConfig",
                data: {
                    game: {
                        timeLimitByPlayer: null,
                        firstPlayer: "self"
                    },
                    room: {
                        ownerPlayer: "opponent",
                        isPublic: false,
                        password: "1234"
                    }
                }
        }))
    })
})