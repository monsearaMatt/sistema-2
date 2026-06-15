import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import { RolesGuard } from '../../../common/auth/roles.guard';
import { Roles } from '../../../common/auth/roles.decorator';
import { RolService } from '../application/rol.service';
import { CrearRolDto } from './dto/crear-rol.dto';

@Controller('rrhh/roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async create(@Body() dto: CrearRolDto) {
    return this.rolService.create(dto.name_rol);
  }

  @Get()
  async findAll() {
    return this.rolService.findAll();
  }
}
