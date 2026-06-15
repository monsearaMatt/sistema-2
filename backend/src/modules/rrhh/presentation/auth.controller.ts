import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

class LoginDto {
  @IsNotEmpty()
  @Matches(/^\d{7,8}-[\dkK]$/, {
    message: 'Formato de RUT inválido (ej: 12345678-9)',
  })
  rut!: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.rut, dto.password);
    if (!user) {
      throw new UnauthorizedException('RUT o contraseña incorrectos');
    }
    const token = await this.authService.login(user);
    const empleado = await this.prisma.rRHH_empleado.findUnique({
      where: { id_empleado: user.id_empleado ?? undefined },
      include: { RRHH_rol: true },
    });
    return {
      access_token: token.access_token,
      user: { tipo: empleado?.RRHH_rol?.name_rol ?? 'Empleado' },
      statusCode: 200,
      success: true,
    };
  }
}
