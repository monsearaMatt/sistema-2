import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CrearDireccionDto } from './dto/crear-direccion.dto';
import { ActualizarDireccionDto } from './dto/actualizar-direccion.dto';
import { DireccionService } from '../application/direccion.service';

@Controller('logistica/direcciones')
@UsePipes(new ValidationPipe({ transform: true }))
export class DireccionController {
  constructor(private readonly direccionService: DireccionService) {}

  @Post()
  async create(@Body() dto: CrearDireccionDto) {
    try {
      return await this.direccionService.create(dto);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear dirección';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    return await this.direccionService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarDireccionDto,
  ) {
    try {
      return await this.direccionService.update(id, dto);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar dirección';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.direccionService.remove(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar dirección';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
