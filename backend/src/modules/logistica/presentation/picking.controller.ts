// File: src/modules/logistica/presentation/picking.controller.ts
// Controller para operaciones de Picking (OTs)
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CrearPickingDto } from './dto/crear-picking.dto';
import { PickingService } from '../application/picking.service';

@Controller('logistica/pickings')
@UsePipes(new ValidationPipe({ transform: true }))
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  @Post()
  @UseGuards(
    require('../../../common/auth/jwt-auth.guard').JwtAuthGuard,
    require('../../../common/auth/roles.guard').RolesGuard,
  )
  // allow both Jefe de Logística and Admin Sistema to create pickings
  // note: using require() so decorators resolve without circular import issues in this code-edit context
  async create(@Body() dto: CrearPickingDto) {
    return this.pickingService.create(dto);
  }

  @Patch(':id/assign')
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body('id_empleado', ParseIntPipe) id_empleado: number,
  ) {
    return this.pickingService.assign(id, id_empleado);
  }

  @Patch(':id/complete')
  async complete(@Param('id', ParseIntPipe) id: number) {
    return this.pickingService.complete(id);
  }

  @Post(':id/confirm-dispatch')
  async confirmDispatch(@Param('id', ParseIntPipe) id: number) {
    return this.pickingService.confirmDispatch(id);
  }

  @Get()
  async findAll() {
    return this.pickingService.findAll();
  }
}
