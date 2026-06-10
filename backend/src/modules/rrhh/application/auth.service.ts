import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { signToken } from '../../../common/auth/token.util';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(username: string, password: string) {
    const existing = await this.prisma.rRHH_usuario.findFirst({
      where: { username },
    });
    if (existing) {
      throw new BadRequestException('El nombre de usuario ya está registrado.');
    }

    // Crear empleado por defecto para el rol de logística
    const defaultEmployee = await this.prisma.rRHH_empleado.create({
      data: {
        nombre: username,
        rut: '12345678-K',
        id_rol: 3, // Jefe de Logística
        estado: 'Activo',
        correo: `${username}@empresa.cl`,
      },
    });

    await this.prisma.rRHH_usuario.create({
      data: {
        username,
        password,
        id_empleado: defaultEmployee.id_empleado,
      },
    });

    return { message: 'Registro exitoso' };
  }

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
    const token = signToken(payload, process.env.JWT_SECRET || 'changeme');
    return {
      message: 'Login successful',
      access_token: token,
      user: {
        tipo: userRecord.RRHH_empleado?.RRHH_rol?.name_rol ?? 'default'
      },
      statusCode: 200,
      success: true
    };
  }
}
