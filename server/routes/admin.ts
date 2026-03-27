import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@theclubapp.com.tr';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || '';

if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD_PLAIN) {
  throw new Error('ADMIN_PASSWORD or ADMIN_PASSWORD_HASH environment variable is not set');
}

async function verifyPassword(input: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    return bcrypt.compare(input, ADMIN_PASSWORD_HASH);
  }
  return input === ADMIN_PASSWORD_PLAIN;
}

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre gerekli' });
  }
  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Geçersiz giriş bilgileri' });
  }
  const valid = await verifyPassword(password);
  if (!valid) {
    return res.status(401).json({ error: 'Geçersiz giriş bilgileri' });
  }
  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET as string, { expiresIn: '8h' });
  return res.json({ token });
});

router.get('/verify', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token gerekli' });
  }
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET as string);
    return res.json({ valid: true, payload });
  } catch {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
});

export default router;
