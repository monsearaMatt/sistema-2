import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import {
  CrearEmpleadoDto,
  ActualizarEmpleadoDto,
} from './dto/crear-empleado.dto';
import { EmpleadoService } from '../application/empleado.service';

@Controller('rrhh/empleados')
@UsePipes(new ValidationPipe({ transform: true }))
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEmpleadoDto,
  ) {
    return this.empleadoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.remove(id);
  }

  @Patch(':id/desactivar')
  @UseGuards(JwtAuthGuard)
  async desactivar(@Param('id', ParseIntPipe) id: number) {
    await this.empleadoService.remove(id);
    return { message: 'Empleado desactivado.' };
  }
}
