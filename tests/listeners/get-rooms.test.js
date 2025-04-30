const WebSocket = require('ws')

module.exports = {
    maxWorkers: 1,
    runInBand: true,
}

test("connect and get rooms", (done) => {
    const socket1 = new WebSocket("ws://localhost:5000/game")

    const doneTest = () => {
        socket1.close()
        done()
    }

    socket1.on('open', () => {
        socket1.on('message', (message) => {
            let _message = JSON.parse(message.toString())

            if(_message.type === 'getRooms'){
                expect(typeof _message.data.rooms).toBe('object')
                doneTest()
            }
        })
        
        socket1.send(JSON.stringify({
            type: 'getRooms'
        }))
    })    
})