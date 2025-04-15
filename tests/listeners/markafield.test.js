const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

//run npm run test tests/listeners/room-editor.test.js 


test('player marking a field and all in room receiving message', (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")
    const socket2 = new WebSocket("ws://localhost:5000/game")

    const doneTest = () => {
        socket1.close()
        socket2.close()
        done()
    }

    let idRoomConnect

    socket1.on('opne', () => {
        socket1.on('mesage', (mesage) => {
            let _message = JSON.parse(mesage.toString())

            if(_message.type === "connectPlayerInGame"){
                idRoomConnect = _message.data.playerData.idRoom
            }
        })

        socket1.send(JSON.stringify({
            type: 'connectPlayerInGame',
            data: {
                alias: 'player-1',
                createRoom: true
            }
        }))
    })

    socket2.on('opne', () => {
        socket1.on('mesage', (mesage) => {
            // let _message = JSON.parse(mesage.toString())

            // if(_message.type === "connectPlayerInGame"){
            //     idRoomConnect = _message.data.playerData.idRoom
            // }
        })

        socket2.send(JSON.stringify({
            type: 'connectPlayerInGame',
            data: {
                alias: 'player-2',
                idRoom: idRoomConnect,
                createRoom: true
            }
        }))
    })
})