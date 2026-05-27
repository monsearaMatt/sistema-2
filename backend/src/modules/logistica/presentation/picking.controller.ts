// File: src/modules/logistica/presentation/picking.controller.ts
// Controller para operaciones de Picking (OTs)
import { Controller, Post, Body, Param, Patch, Get, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CrearPickingDto } from './dto/crear-picking.dto';
import { PickingService } from '../application/picking.service';

@Controller('logistica/pickings')
@UsePipes(new ValidationPipe({ transform: true }))
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  @Post()
  async create(@Body() dto: CrearPickingDto) {
    return this.pickingService.create(dto);
  }

  @Patch(':id/assign')
  async assign(@Param('id', ParseIntPipe) id: number, @Body('id_empleado', ParseIntPipe) id_empleado: number) {
    return this.pickingService.assign(id, id_empleado);
  }

  @Patch(':id/complete')
  async complete(@Param('id', ParseIntPipe) id: number) {
    return this.pickingService.complete(id);
  }

  @Get()
  async findAll() {
    return this.pickingService.findAll();
  }
}
