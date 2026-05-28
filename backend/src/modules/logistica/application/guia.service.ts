// File: src/modules/logistica/application/guia.service.ts
// Servicio para log_guia_despacho: create, findAll
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearGuiaDespachoDto } from '../presentation/dto/crear-guia-despacho.dto';

@Injectable()
export class GuiaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearGuiaDespachoDto) {
    try {
      return this.prisma.log_guia_despacho.create({
        data: {
          // conectamos por relaciones a picking, transportista y direccion
          log_picking: { connect: { id_ot: dto.id_ot } },
          log_transportista: {
            connect: { id_transportista: dto.id_transportista },
          },
          direccion: { connect: { id_direccion: dto.id_direccion } },
          // fecha_emision la deja la BD o se puede dejar en null y el trigger/cliente la llena
        },
      });
    } catch (err) {
      throw new BadRequestException(
        'Error creando guía de despacho. Verifique referencias.',
      );
    }
  }

  async findAll() {
    return this.prisma.log_guia_despacho.findMany({
      include: { direccion: true, log_picking: true, log_transportista: true },
    });
  }
}
