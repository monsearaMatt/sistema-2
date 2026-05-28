// File: src/modules/logistica/presentation/direccion.controller.ts
// Controlador HTTP para Direcciones (Logistica)
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrearDireccionDto } from './dto/crear-direccion.dto';
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
}
