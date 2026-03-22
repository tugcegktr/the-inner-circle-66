import { Router, Request, Response } from 'express';
import pool from '../db.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { phone, name } = req.body ?? {};
  if (!phone) return res.status(400).json({ error: 'Telefon numarası gerekli' });

  try {
    const existing = await pool.query(
      'SELECT id, phone, name, status, subscription_status, created_at FROM club_users WHERE phone = $1',
      [phone]
    );

    if (existing.rows.length > 0) {
      return res.json({ user: existing.rows[0], created: false });
    }

    const result = await pool.query(
      `INSERT INTO club_users (phone, name, status, subscription_status)
       VALUES ($1, $2, 'pending', 'none')
       RETURNING id, phone, name, status, subscription_status, created_at`,
      [phone, name || null]
    );

    return res.status(201).json({ user: result.rows[0], created: true });
  } catch (err) {
    console.error('[users] register error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/status', async (req: Request, res: Response) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'Telefon numarası gerekli' });

  try {
    const result = await pool.query(
      'SELECT id, phone, name, status, subscription_status, created_at FROM club_users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[users] status error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
