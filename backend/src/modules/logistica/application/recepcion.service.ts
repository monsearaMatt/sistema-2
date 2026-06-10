import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearRecepcionDto } from '../presentation/dto/crear-recepcion.dto';

@Injectable()
export class RecepcionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CrearRecepcionDto) {
    // 1. Validate that the purchase order exists
    const oc = await this.prisma.ordenCompra.findUnique({
      where: { id: dto.id_orden_compra },
    });
    if (!oc) {
      throw new NotFoundException(`Orden de Compra #${dto.id_orden_compra} no encontrada`);
    }

    // 2. Validate that the employee exists in RRHH
    const empleado = await this.prisma.rRHH_empleado.findUnique({
      where: { id_empleado: dto.id_empleado },
    });
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${dto.id_empleado} no encontrado en RRHH`);
    }

    // 3. Check if reception already exists for this OC
    const existing = await this.prisma.log_recepcion.findFirst({
      where: { id_orden_compra: dto.id_orden_compra },
    });
    if (existing) {
      throw new BadRequestException(`La Orden de Compra #${dto.id_orden_compra} ya tiene un registro de recepción`);
    }

    // 4. Create reception
    return this.prisma.log_recepcion.create({
      data: {
        id_orden_compra: dto.id_orden_compra,
        id_empleado: dto.id_empleado,
        fecha_recepcion: new Date(),
      },
      include: {
        RRHH_empleado: true,
      },
    });
  }

  async confirmReceipt(id_recepcion: number) {
    // 1. Fetch reception
    const reception = await this.prisma.log_recepcion.findUnique({
      where: { id_recepcion },
    });
    if (!reception) {
      throw new NotFoundException(`Registro de recepción #${id_recepcion} no encontrado`);
    }

    if (!reception.id_orden_compra) {
      throw new BadRequestException(`El registro de recepción #${id_recepcion} no tiene una orden de compra asociada`);
    }

    // 2. Fetch purchase order
    const oc = await this.prisma.ordenCompra.findUnique({
      where: { id: reception.id_orden_compra },
      include: { Detalle_OC: true },
    });

    if (!oc) {
      throw new NotFoundException(`Orden de Compra #${reception.id_orden_compra} no encontrada`);
    }

    if (oc.ingresada) {
      throw new BadRequestException(`La Orden de Compra #${oc.id} ya fue ingresada a inventario`);
    }

    // 3. Process stock updates in transaction
    return this.prisma.$transaction(async (tx) => {
      for (const item of oc.Detalle_OC) {
        let product: any = null;

        // A. If id_producto is UUID, look it up directly
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id_producto);
        if (isUuid) {
          product = await tx.producto.findUnique({
            where: { id_producto: item.id_producto },
          });
        }

        // B. If not found and fits in code length, look up by code
        if (!product && item.id_producto.length <= 12) {
          product = await tx.producto.findUnique({
            where: { codigo: item.id_producto },
          });
        }

        // C. Look up by name case-insensitively
        if (!product) {
          product = await tx.producto.findFirst({
            where: { nombre: { equals: item.nombre_producto, mode: 'insensitive' } },
          });
        }

        // D. Create if still not found
        if (!product) {
          const baseCode = isUuid
            ? `PRO-${item.nombre_producto.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase()}`
            : item.id_producto.substring(0, 12).toUpperCase();

          let finalCode = baseCode;
          let exists = await tx.producto.findUnique({ where: { codigo: finalCode } });
          let counter = 1;
          while (exists && counter < 100) {
            finalCode = `${baseCode.substring(0, 9)}-${counter}`;
            exists = await tx.producto.findUnique({ where: { codigo: finalCode } });
            counter++;
          }

          product = await tx.producto.create({
            data: {
              id_producto: isUuid ? item.id_producto : undefined,
              codigo: finalCode,
              nombre: item.nombre_producto,
              precio: item.precio_unitario,
              stock_actual: 0,
              stock_minimo: 0,
            },
          });
        }

        // Increase stock
        product = await tx.producto.update({
          where: { id_producto: product.id_producto },
          data: {
            stock_actual: product.stock_actual + item.cantidad,
          },
        });

        // Register movement
        await tx.inv_movimiento.create({
          data: {
            tipo: 'ENTRADA',
            cantidad: item.cantidad,
            referencia: `Recepción Compra OC #${oc.id.substring(0, 8)}`,
            empleado_id: reception.id_empleado ? `emp-${reception.id_empleado}` : 'system-logistica',
            producto_id: product.id_producto,
          },
        });
      }

      // Update purchase order state
      await tx.ordenCompra.update({
        where: { id: oc.id },
        data: {
          ingresada: true,
          estado: 'RECIBIDA',
        },
      });

      return {
        success: true,
        reception,
        message: 'Ingreso a inventario confirmado y stock actualizado exitosamente',
      };
    });
  }

  async findAll() {
    return this.prisma.log_recepcion.findMany({
      include: {
        RRHH_empleado: true,
      },
      orderBy: { id_recepcion: 'desc' },
    });
  }
}
