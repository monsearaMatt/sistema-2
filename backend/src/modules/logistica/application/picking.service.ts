// File: src/modules/logistica/application/picking.service.ts
// Servicio para log_picking: create, assign, findAll
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearPickingDto } from '../presentation/dto/crear-picking.dto';

@Injectable()
export class PickingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearPickingDto) {
    const data: any = {
      id_pedido_venta: dto.id_pedido_venta ?? null,
      fecha_creacion: new Date(),
      estado: dto.estado ?? 'Pendiente',
    };

    return this.prisma.log_picking.create({ data });
  }

  async assign(id_ot: number, id_empleado: number) {
    // Intentar asignar el empleado; si no existe FK, la BD lanzará error
    try {
      return this.prisma.log_picking.update({
        where: { id_ot },
        data: { id_empleado, estado: 'En Proceso' },
      });
    } catch (err) {
      throw new BadRequestException(
        'No se pudo asignar el empleado. Verifique el id_empleado.',
      );
    }
  }

  async complete(id_ot: number) {
    return this.prisma.log_picking.update({
      where: { id_ot },
      data: { estado: 'Completado' },
    });
  }

  async findAll() {
    return this.prisma.log_picking.findMany();
  }
}
