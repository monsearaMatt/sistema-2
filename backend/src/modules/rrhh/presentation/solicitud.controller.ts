import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  CrearSolicitudDto,
  ActualizarSolicitudDto,
} from './dto/crear-solicitud.dto';
import { SolicitudService } from '../application/solicitud.service';

@Controller('rrhh/solicitudes')
@UsePipes(new ValidationPipe({ transform: true }))
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post()
  async create(@Body() dto: CrearSolicitudDto) {
    return this.solicitudService.create(dto);
  }

  @Get()
  async findAll() {
    return this.solicitudService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSolicitudDto,
  ) {
    return this.solicitudService.update(id, dto);
  }
}
