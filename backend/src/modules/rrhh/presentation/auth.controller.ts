import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { IsNotEmpty } from 'class-validator';

class LoginDto {
  @IsNotEmpty()
  rut!: string;

  @IsNotEmpty()
  password!: string;
}

class RegisterDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.rut, dto.password);
    if (!user) {
      return { status: 'error', message: 'Invalid credentials' };
    }
    const token = await this.authService.login(user);
    return {
      access_token: token.access_token,
      user: { tipo: user.RRHH_empleado?.RRHH_rol?.name_rol ?? 'Empleado' },
      statusCode: 200,
      success: true,
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.prisma.rRHH_usuario.findFirst({
      where: { username: dto.username },
    });
    if (existing) {
      return { status: 'error', message: 'Username already exists' };
    }
    await this.prisma.rRHH_usuario.create({
      data: { username: dto.username, password: dto.password },
    });
    return { message: 'User registered successfully' };
  }
}
