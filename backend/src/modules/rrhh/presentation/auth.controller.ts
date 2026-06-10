import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { IsNotEmpty } from 'class-validator';

class LoginDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}

@Controller('rrhh/auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.username, dto.password);
    if (!user) {
      return { status: 'error', message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
}
