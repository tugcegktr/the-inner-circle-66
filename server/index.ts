import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import adminRouter from './routes/admin.js';
import adminUsersRouter from './routes/adminUsers.js';
import usersRouter from './routes/users.js';
import { setupWebSocket } from './websocket.js';

const app = express();
const PORT = Number(process.env.PORT_API) || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

// ── 1. Security headers (Helmet) ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── 2. CORS ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /\.replit\.dev$/,
  /\.repl\.co$/,
  'https://www.theclubapp.com.tr',
  'https://theclubapp.com.tr',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));

// ── 3. Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ── 4. Global rate limit — 100 requests / 15 min per IP ───────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 15 dakika bekleyin.' },
});
app.use(globalLimiter);

// ── 5. Strict rate limit on auth endpoint — 10 attempts / 15 min per IP ───────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla giriş denemesi. Lütfen 15 dakika bekleyin.' },
});
app.use('/api/admin/login', authLimiter);

// ── 6. Routes ─────────────────────────────────────────────────────────────────
app.use('/api/admin', adminRouter);
app.use('/api/admin', adminUsersRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'The Club Admin API' });
});

// ── 7. Global error handler — never leaks stack traces ────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (IS_PROD) {
    console.error('[error]', err.message);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
  console.error('[error]', err);
  return res.status(500).json({ error: err.message });
});

// ── 8. Start ──────────────────────────────────────────────────────────────────
const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`[server] Admin API running on port ${PORT}`);
  console.log(`[server] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});
