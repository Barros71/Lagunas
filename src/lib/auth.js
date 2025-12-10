import { verifyToken } from '@/lib/jwt';

function parseTokenFromRequest(req) {
  const cookieHeader = req.headers?.get ? req.headers.get('cookie') : (req.headers && req.headers.cookie) || '';
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  if (!tokenCookie) return null;
  return decodeURIComponent(tokenCookie.split('=')[1]);
}

export function verifyAuth(request) {
  try {
    const token = parseTokenFromRequest(request);
    if (!token) return null;
    const payload = verifyToken(token);
    return payload;
  } catch (err) {
    return null;
  }
}

export default verifyAuth;
