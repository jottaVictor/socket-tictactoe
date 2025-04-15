import config from './config.js'
import { WebSocketServer, WebSocket } from 'ws';
import WebSocketGameHandler from './routes/game/websocket-game-handler.js';

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

    routes[path](ws, req);
})

console.log(`WebSocket Server running on ${config.URL}}`);