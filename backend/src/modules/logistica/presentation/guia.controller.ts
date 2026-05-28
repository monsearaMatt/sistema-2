// File: src/modules/logistica/presentation/guia.controller.ts
// Controller para guías de despacho
import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CrearGuiaDespachoDto } from './dto/crear-guia-despacho.dto';
import { GuiaService } from '../application/guia.service';

@Controller('logistica/guias')
@UsePipes(new ValidationPipe({ transform: true }))
export class GuiaController {
  constructor(private readonly guiaService: GuiaService) {}

  @Post()
  async create(@Body() dto: CrearGuiaDespachoDto) {
    return this.guiaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.guiaService.findAll();
  }
}
