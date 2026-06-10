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
} from '@nestjs/common';
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEmpleadoDto,
  ) {
    return this.empleadoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.remove(id);
  }

  @Patch(':id/desactivar')
  async desactivar(@Param('id', ParseIntPipe) id: number) {
    await this.empleadoService.remove(id);
    return { message: 'Empleado desactivado.' };
  }
}
