import { WebSocketServer, WebSocket } from 'ws';
import WebSocketGameHandler from './routes/game/websocket-game-handler.js';

const PORT = 5000;
const wss = new WebSocketServer({ port: PORT });
const gameHandler = new WebSocketGameHandler(wss);

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

console.log(`WebSocket Server running on ws://localhost:${PORT}`);
