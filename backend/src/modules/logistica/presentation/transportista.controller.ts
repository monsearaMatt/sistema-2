// File: src/modules/logistica/presentation/transportista.controller.ts
// Controlador HTTP para Transportistas (Logistica)
import { Controller, Post, Get, Body, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CrearTransportistaDto } from './dto/crear-transportista.dto';
import { TransportistaService } from '../application/transportista.service';

@Controller('logistica/transportistas')
@UsePipes(new ValidationPipe({ transform: true }))
export class TransportistaController {
  constructor(private readonly transportistaService: TransportistaService) {}

  @Post()
  async create(@Body() dto: CrearTransportistaDto) {
    try {
      return await this.transportistaService.create(dto);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear transportista';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    return await this.transportistaService.findAll();
  }
}
