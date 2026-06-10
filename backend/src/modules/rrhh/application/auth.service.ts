import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { signToken } from '../../../common/auth/token.util';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.rRHH_usuario.findFirst({
      where: { username },
      include: { RRHH_empleado: { include: { RRHH_rol: true } } },
    });
    if (!user) return null;
    // NOTE: seeds use plaintext passwords for MVP; compare directly
    if (user.password !== password) return null;
    return user;
  }

  async login(userRecord: any) {
    if (!userRecord) throw new UnauthorizedException();
    const payload = {
      sub: userRecord.id_usuario,
      id_empleado: userRecord.id_empleado,
      role: userRecord.RRHH_empleado?.RRHH_rol?.name_rol ?? null,
      username: userRecord.username,
    };
    return { access_token: signToken(payload, process.env.JWT_SECRET || 'changeme') };
  }
}
