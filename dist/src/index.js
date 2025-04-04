import { WebSocketServer } from 'ws';
import WebSocketGameHandler from './routes/game/websocket-game-handler.js';
const PORT = 5000;
const wss = new WebSocketServer({ port: PORT });
const gameHandler = new WebSocketGameHandler(wss);
const routes = {
    "/game": (ws, req) => {
        gameHandler.handler(ws, req);
    }
};
wss.on('connection', (ws, req) => {
    const path = req.url;
    if (!routes.hasOwnProperty(path)) {
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
});
console.log(`WebSocket Server running on ws://localhost:${PORT}`);
