import { createHmac } from 'crypto';

type JwtPayload = Record<string, unknown>;

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export function signToken(payload: JwtPayload, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string, secret: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = createHmac('sha256', secret).update(data).digest('base64url');
  if (expected !== signature) {
    throw new Error('Invalid token signature');
  }
  return JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
}
