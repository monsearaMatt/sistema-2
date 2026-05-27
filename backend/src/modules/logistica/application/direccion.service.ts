// File: src/modules/logistica/application/direccion.service.ts
// Servicio de aplicación para Direcciones que usa PrismaService
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearDireccionDto } from '../presentation/dto/crear-direccion.dto';

@Injectable()
export class DireccionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearDireccionDto) {
    // Prisma espera los campos tal como están en el schema generado.
    return this.prisma.direccion.create({
      data: {
        direccion: dto.direccion,
        id_cliente: dto.id_cliente,
      },
    });
  }

  async findAll() {
    return this.prisma.direccion.findMany();
  }
}
