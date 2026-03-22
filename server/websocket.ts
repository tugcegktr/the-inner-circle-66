import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';

const clients = new Map<string, WebSocket>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const phone = url.searchParams.get('phone') || '';

    if (phone) {
      clients.set(phone, ws);
      console.log(`[ws] client connected: ${phone}`);
    }

    ws.on('close', () => {
      if (phone) {
        clients.delete(phone);
        console.log(`[ws] client disconnected: ${phone}`);
      }
    });

    ws.on('error', (err) => {
      console.error('[ws] error:', err.message);
    });
  });

  console.log('[ws] WebSocket server attached at /ws');
}

export function notifyUser(phone: string, message: object) {
  const ws = clients.get(phone);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    console.log(`[ws] notified ${phone}:`, message);
  }
}
