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
import { CrearTransportistaDto } from './dto/crear-transportista.dto';
import { ActualizarTransportistaDto } from './dto/actualizar-transportista.dto';
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
      const message =
        err instanceof Error ? err.message : 'Error al crear transportista';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    return await this.transportistaService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTransportistaDto,
  ) {
    try {
      return await this.transportistaService.update(id, dto);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al actualizar transportista';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.transportistaService.remove(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar transportista';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
