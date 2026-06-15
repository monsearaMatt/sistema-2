import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import { RolesGuard } from '../../../common/auth/roles.guard';
import { Roles } from '../../../common/auth/roles.decorator';
import {
  CrearSolicitudDto,
  ActualizarSolicitudDto,
} from './dto/crear-solicitud.dto';
import { SolicitudService } from '../application/solicitud.service';

@Controller('rrhh/solicitudes')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin RRHH', 'Admin Sistema')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSolicitudDto,
  ) {
    return this.solicitudService.update(id, dto);
  }
}
