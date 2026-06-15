import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import { RolesGuard } from '../../../common/auth/roles.guard';
import { Roles } from '../../../common/auth/roles.decorator';
import {
  CrearEmpleadoDto,
  ActualizarEmpleadoDto,
} from './dto/crear-empleado.dto';
import { EmpleadoService } from '../application/empleado.service';

@Controller('rrhh/empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async create(@Body() dto: CrearEmpleadoDto) {
    return this.empleadoService.create(dto);
  }

  @Get()
  async findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEmpleadoDto,
  ) {
    return this.empleadoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.remove(id);
  }

  @Patch(':id/desactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async desactivar(@Param('id', ParseIntPipe) id: number) {
    await this.empleadoService.remove(id);
    return { message: 'Empleado desactivado.' };
  }
}
