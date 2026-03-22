import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT_API) || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/admin', adminRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'The Club Admin API' });
});

app.listen(PORT, () => {
  console.log(`[server] Admin API running on port ${PORT}`);
});
