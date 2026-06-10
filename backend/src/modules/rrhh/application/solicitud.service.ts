import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearSolicitudDto, ActualizarSolicitudDto } from '../presentation/dto/crear-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearSolicitudDto) {
    const fecha_inicio = new Date(dto.fecha_inicio);
    const fecha_fin = new Date(dto.fecha_fin);
    const solicitud = await this.prisma.rRHH_solicitud.create({
      data: {
        RRHH_empleado: { connect: { id_empleado: dto.id_empleado } },
        tipo_solicitud: dto.tipo_solicitud,
        fecha_inicio,
        fecha_fin,
        estado: dto.estado ?? 'Pendiente',
      },
      include: { RRHH_empleado: true },
    });
    return this.toFrontend(solicitud);
  }

  async findAll() {
    const solicitudes = await this.prisma.rRHH_solicitud.findMany({
      include: { RRHH_empleado: true },
    });
    return solicitudes.map((s) => this.toFrontend(s));
  }

  async findOne(id_solicitud: number) {
    const solicitud = await this.prisma.rRHH_solicitud.findUnique({
      where: { id_solicitud },
      include: { RRHH_empleado: true },
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con id ${id_solicitud} no encontrada`);
    }
    return this.toFrontend(solicitud);
  }

  async update(id_solicitud: number, dto: ActualizarSolicitudDto) {
    const solicitud = await this.prisma.rRHH_solicitud.findUnique({
      where: { id_solicitud },
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con id ${id_solicitud} no encontrada`);
    }
    const data: {
      estado: string;
      tipo_solicitud?: string;
      fecha_inicio?: Date;
      fecha_fin?: Date;
    } = { estado: dto.estado };
    if (dto.tipo_solicitud !== undefined) data.tipo_solicitud = dto.tipo_solicitud;
    if (dto.fecha_inicio !== undefined) data.fecha_inicio = new Date(dto.fecha_inicio);
    if (dto.fecha_fin !== undefined) data.fecha_fin = new Date(dto.fecha_fin);
    const updated = await this.prisma.rRHH_solicitud.update({
      where: { id_solicitud },
      data,
      include: { RRHH_empleado: true },
    });
    return this.toFrontend(updated);
  }

  private toFrontend(s: any) {
    const inicio = s.fecha_inicio ? new Date(s.fecha_inicio) : new Date();
    const fin = s.fecha_fin ? new Date(s.fecha_fin) : new Date();
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return {
      id_solicitud: String(s.id_solicitud),
      id_empleado: String(s.id_empleado),
      nombre_empleado: s.RRHH_empleado?.nombre ?? '',
      tipo_solicitud: s.tipo_solicitud,
      fecha_inicio: inicio.toISOString().split('T')[0],
      fecha_fin: fin.toISOString().split('T')[0],
      dias,
      estado: (s.estado as string).toUpperCase(),
    };
  }
}
