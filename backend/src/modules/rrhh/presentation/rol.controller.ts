import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import { RolService } from '../application/rol.service';

@Controller('rrhh/roles')
@UsePipes(new ValidationPipe({ transform: true }))
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body('name_rol') name_rol: string) {
    return this.rolService.create(name_rol);
  }

  @Get()
  async findAll() {
    return this.rolService.findAll();
  }
}
