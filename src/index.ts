import config from './config.js'
import { WebSocketServer, WebSocket } from 'ws';
import WebSocketGameHandler from './routes/game/websocket-game-handler.js';
import readline from 'readline'

const wss = new WebSocketServer({ port: config.PORT });
const gameHandler = new WebSocketGameHandler();

const routes: Record<string, (ws: WebSocket, req: any) => void> = {
    "/game": (ws: WebSocket, req: any): void => {
        gameHandler.handler(ws, req)
    }
}

wss.on('connection', (ws: WebSocket, req: any) => {
    const path = req.url;
    if (!(path in routes)) {
        ws.send(JSON.stringify({
            message: 'Rota não encontrada.',
            code: 0,
            data: {},
            success: false
        }));
        ws.close();
        return;
    }

    routes[path](ws, req)
})

console.log(`WebSocket Server running on ${config.URL}}`)

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

function escutarTecla() {
    if (!process.stdin.isTTY) {
        console.log('Este terminal não suporta entrada interativa (TTY).')
        return
    }

    console.log('Tecle qualquer tecla para limpar a tela...')

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.once('data', (key) => {
        if (key.toString() === 'q') {
            console.log('Saindo...')
            process.exit()
        }

        console.clear()
        console.log('Tela limpa! Continuando...')
        process.stdin.setRawMode(false)
        process.stdin.pause()
        escutarTecla()
    })
}

escutarTecla()