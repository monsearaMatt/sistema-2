import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CrearRecepcionDto } from './dto/crear-recepcion.dto';
import { RecepcionService } from '../application/recepcion.service';

@Controller('logistica/recepciones')
@UsePipes(new ValidationPipe({ transform: true }))
export class RecepcionController {
  constructor(private readonly recepcionService: RecepcionService) {}

  @Post()
  async create(@Body() dto: CrearRecepcionDto) {
    return this.recepcionService.create(dto);
  }

  @Post(':id/confirm-receipt')
  async confirmReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.recepcionService.confirmReceipt(id);
  }

  @Get()
  async findAll() {
    return this.recepcionService.findAll();
  }
}
