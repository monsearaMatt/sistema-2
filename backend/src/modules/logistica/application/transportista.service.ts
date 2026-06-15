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
    return this.prisma.log_transportista.findMany({
      include: { RRHH_empleado: true },
    });
  }

  async update(id_transportista: number, dto: any) {
    const data: any = {};
    if (dto.nombre_transp !== undefined) data.nombre_transp = dto.nombre_transp;
    if (dto.patente_vehiculo !== undefined)
      data.patente_vehiculo = dto.patente_vehiculo;
    if (dto.id_empleado !== undefined) {
      data.RRHH_empleado = { connect: { id_empleado: dto.id_empleado } };
    }

    return this.prisma.log_transportista.update({
      where: { id_transportista },
      data,
    });
  }

  async remove(id_transportista: number) {
    return this.prisma.log_transportista.delete({
      where: { id_transportista },
    });
  }
}
