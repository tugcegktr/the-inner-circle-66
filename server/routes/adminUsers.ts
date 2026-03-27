import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { notifyUser } from '../websocket.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token gerekli' });
  try {
    jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Geçersiz token' });
  }
}

router.get('/users', requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const q = status
      ? 'SELECT id, phone, name, status, subscription_status, created_at FROM club_users WHERE status = $1 ORDER BY created_at DESC'
      : 'SELECT id, phone, name, status, subscription_status, created_at FROM club_users ORDER BY created_at DESC';
    const params = status ? [status] : [];
    const result = await pool.query(q, params);
    return res.json({ users: result.rows });
  } catch (err) {
    console.error('[admin] list users error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'approved' AND created_at >= NOW() - INTERVAL '7 days') AS this_week,
        COUNT(*) FILTER (WHERE subscription_status = 'active') AS active_subscriptions
      FROM club_users
    `);
    const row = result.rows[0];
    return res.json({
      pending: Number(row.pending),
      approved: Number(row.approved),
      thisWeek: Number(row.this_week),
      activeSubscriptions: Number(row.active_subscriptions),
    });
  } catch (err) {
    console.error('[admin] stats error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/users/:id/approve', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE club_users SET status = 'approved', updated_at = NOW()
       WHERE id = $1 RETURNING id, phone, name, status`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    const user = result.rows[0];
    notifyUser(user.phone, { type: 'approved', userId: user.id });
    return res.json({ user });
  } catch (err) {
    console.error('[admin] approve error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/users/:id/reject', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE club_users SET status = 'rejected', updated_at = NOW()
       WHERE id = $1 RETURNING id, phone, name, status`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    const user = result.rows[0];
    notifyUser(user.phone, { type: 'rejected', userId: user.id });
    return res.json({ user });
  } catch (err) {
    console.error('[admin] reject error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
