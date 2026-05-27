// File: src/modules/logistica/application/transportista.service.ts
// Servicio de aplicación para Transportistas que usa PrismaService.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearTransportistaDto } from '../presentation/dto/crear-transportista.dto';

@Injectable()
export class TransportistaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearTransportistaDto) {
    // Conectar el transportista a un empleado existente en RRHH usando la relación
    return this.prisma.log_transportista.create({
      data: {
        nombre_transp: dto.nombre_transp,
        patente_vehiculo: dto.patente_vehiculo,
        RRHH_empleado: { connect: { id_empleado: dto.id_empleado } },
      },
    });
  }

  async findAll() {
    // Incluir la relación a RRHH_empleado para devolver datos del empleado asociado
    return this.prisma.log_transportista.findMany({ include: { RRHH_empleado: true } });
  }
}
