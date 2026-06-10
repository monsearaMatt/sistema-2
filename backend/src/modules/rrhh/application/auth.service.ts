import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { signToken } from '../../../common/auth/token.util';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(rut: string, password: string) {
    const empleado = await this.prisma.rRHH_empleado.findFirst({
      where: { rut },
      include: {
        RRHH_rol: true,
        RRHH_usuario: true,
      },
    });
    if (!empleado) return null;
    const usuario = empleado.RRHH_usuario?.[0];
    if (!usuario) return null;
    if (usuario.password !== password) return null;
    return usuario;
  }

  async login(userRecord: any) {
    if (!userRecord) throw new UnauthorizedException();
    const empleado = await this.prisma.rRHH_empleado.findUnique({
      where: { id_empleado: userRecord.id_empleado ?? undefined },
      include: { RRHH_rol: true },
    });
    const payload = {
      sub: userRecord.id_usuario,
      id_empleado: userRecord.id_empleado,
      role: empleado?.RRHH_rol?.name_rol ?? null,
      username: userRecord.username,
    };
    return { access_token: signToken(payload, process.env.JWT_SECRET || 'changeme') };
  }
}
