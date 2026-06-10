// File: src/modules/logistica/application/picking.service.ts
// Servicio para log_picking: create, assign, findAll, confirmDispatch
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CrearPickingDto } from '../presentation/dto/crear-picking.dto';

@Injectable()
export class PickingService {
  constructor(private readonly prisma: PrismaService) {}

  private mapVentasIdToInventarioCode(id: number): string {
    const map: Record<number, string> = {
      5001: 'ACC-001', // Mouse Gaming HyperX
      5005: 'ACC-010', // Audifonos JBL
      5010: 'NOT-011', // ASUS TUF 15
      5015: 'NOT-012', // Notebook Lenovo
      5020: 'NOT-090', // Notebook Thinkpad X15
      1: 'NOT-NOTE',    // NOTEBOOK AB
    };
    return map[id] || 'PRO-PROD'; // Fallback to Producto 1
  }

  async create(dto: CrearPickingDto) {
    const data: any = {
      id_pedido_venta: dto.id_pedido_venta ?? null,
      fecha_creacion: new Date(),
      estado: dto.estado ?? 'Pendiente',
    };

    return this.prisma.log_picking.create({ data });
  }

  async assign(id_ot: number, id_empleado: number) {
    try {
      return await this.prisma.log_picking.update({
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

  async confirmDispatch(id_ot: number) {
    const picking = await this.prisma.log_picking.findUnique({
      where: { id_ot },
    });

    if (!picking) {
      throw new NotFoundException(`Picking OT #${id_ot} no encontrado`);
    }

    if (!picking.id_pedido_venta) {
      throw new BadRequestException(`El picking OT #${id_ot} no está asociado a ningún pedido de ventas`);
    }

    const salesOrder = await this.prisma.ventas_pedido.findUnique({
      where: { id_pedido: picking.id_pedido_venta },
      include: { ventas_detalle: true },
    });

    if (!salesOrder) {
      throw new NotFoundException(`Pedido de ventas #${picking.id_pedido_venta} no encontrado`);
    }

    if (salesOrder.estado === 'enviado' || salesOrder.estado === 'completado') {
      throw new BadRequestException(`El pedido de ventas #${salesOrder.id_pedido} ya ha sido procesado (estado: ${salesOrder.estado})`);
    }

    // Process all stock deductions inside a transaction
    return this.prisma.$transaction(async (tx) => {
      for (const item of salesOrder.ventas_detalle) {
        const productCode = this.mapVentasIdToInventarioCode(item.id_producto);
        
        let product = await tx.producto.findUnique({
          where: { codigo: productCode },
        });

        if (!product) {
          throw new NotFoundException(`Producto de inventario con código "${productCode}" no encontrado`);
        }

        if (product.stock_actual < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente en inventario para "${product.nombre}". Disponible: ${product.stock_actual}, Solicitado: ${item.cantidad}`
          );
        }

        // Deduct stock
        product = await tx.producto.update({
          where: { id_producto: product.id_producto },
          data: {
            stock_actual: product.stock_actual - item.cantidad,
          },
        });

        // Register movement
        await tx.inv_movimiento.create({
          data: {
            tipo: 'SALIDA',
            cantidad: item.cantidad,
            referencia: `Despacho Picking OT #${id_ot}`,
            empleado_id: picking.id_empleado ? `emp-${picking.id_empleado}` : 'system-logistica',
            producto_id: product.id_producto,
          },
        });
      }

      // Update states
      const updatedPicking = await tx.log_picking.update({
        where: { id_ot },
        data: { estado: 'Completado' },
      });

      await tx.ventas_pedido.update({
        where: { id_pedido: salesOrder.id_pedido },
        data: { estado: 'enviado' },
      });

      return {
        success: true,
        picking: updatedPicking,
        message: 'Egreso de inventario confirmado y despacho realizado con éxito',
      };
    });
  }

  async findAll() {
    return this.prisma.log_picking.findMany({
      include: {
        RRHH_empleado: true,
      },
      orderBy: { id_ot: 'desc' },
    });
  }
}
