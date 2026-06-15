import { createHmac } from 'crypto';

type JwtPayload = Record<string, unknown>;

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export function signToken(payload: JwtPayload, secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const enriched = {
    ...payload,
    iat: now,
    exp: now + 86400, // 24 hours
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(enriched));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string, secret: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  if (expected !== signature) {
    throw new Error('Invalid token signature');
  }
  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && typeof payload.exp === 'number' && payload.exp < now) {
    throw new Error('Token expired');
  }
  return payload;
}
