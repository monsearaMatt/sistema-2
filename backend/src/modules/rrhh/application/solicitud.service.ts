import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CrearSolicitudDto,
  ActualizarSolicitudDto,
} from '../presentation/dto/crear-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearSolicitudDto) {
    const fecha_inicio = new Date(dto.fecha_inicio);
    const fecha_fin = new Date(dto.fecha_fin);
    return this.prisma.rRHH_solicitud.create({
      data: {
        RRHH_empleado: { connect: { id_empleado: dto.id_empleado } },
        tipo_solicitud: dto.tipo_solicitud,
        fecha_inicio,
        fecha_fin,
        estado: dto.estado ?? 'Pendiente',
      },
      include: { RRHH_empleado: true },
    });
  }

  async findOne(id_solicitud: number) {
    const solicitud = await this.prisma.rRHH_solicitud.findUnique({
      where: { id_solicitud },
      include: { RRHH_empleado: true },
    });
    if (!solicitud) {
      throw new NotFoundException(
        `Solicitud con id ${id_solicitud} no encontrada`,
      );
    }
    return solicitud;
  }

  async findAll() {
    return this.prisma.rRHH_solicitud.findMany({
      include: { RRHH_empleado: true },
    });
  }

  async update(id_solicitud: number, dto: ActualizarSolicitudDto) {
    const solicitud = await this.prisma.rRHH_solicitud.findUnique({
      where: { id_solicitud },
    });
    if (!solicitud) {
      throw new NotFoundException(
        `Solicitud con id ${id_solicitud} no encontrada`,
      );
    }
    const data: {
      estado: string;
      tipo_solicitud?: string;
      fecha_inicio?: Date;
      fecha_fin?: Date;
    } = { estado: dto.estado };
    if (dto.tipo_solicitud !== undefined)
      data.tipo_solicitud = dto.tipo_solicitud;
    if (dto.fecha_inicio !== undefined)
      data.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.fecha_fin !== undefined) data.fecha_fin = new Date(dto.fecha_fin);
    return this.prisma.rRHH_solicitud.update({
      where: { id_solicitud },
      data,
      include: { RRHH_empleado: true },
    });
  }
}
