import http from 'http';
import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin.js';
import adminUsersRouter from './routes/adminUsers.js';
import usersRouter from './routes/users.js';
import { setupWebSocket } from './websocket.js';

const app = express();
const PORT = Number(process.env.PORT_API) || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/admin', adminUsersRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'The Club Admin API' });
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`[server] Admin API running on port ${PORT}`);
});
