import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyToken } from './token.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth) return false;
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return false;
    try {
      const payload = verifyToken(
        parts[1],
        process.env.JWT_SECRET || 'sistema-2-secret-key',
      );
      req.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}
