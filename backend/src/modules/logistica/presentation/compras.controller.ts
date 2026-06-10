import { Controller, Get, Patch, Param, Body, UsePipes, ValidationPipe, Post } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import ComprasClient from '../infrastructure/compras.client';
import { ActualizarCompraDto } from './dto/actualizar-compra.dto';

const comprasClient = new ComprasClient();

@Controller('logistica/compras')
@UsePipes(new ValidationPipe({ transform: true }))
export class ComprasController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async create(@Body() body: any) {
    const id_usuario = body.userId && body.userId.match(/^[0-9a-fA-F-]{36}$/)
      ? body.userId
      : '00000000-0000-0000-0000-000000000000';

    const total = body.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

    return this.prisma.ordenCompra.create({
      data: {
        id_proveedor: body.supplierId,
        fecha_creacion: new Date(body.createdAt),
        estado: 'PENDIENTE',
        total,
        id_usuario,
        ingresada: false,
        Detalle_OC: {
          create: body.items.map((item: any) => ({
            id_producto: '860f8184-7839-4df3-92d1-ab1960449030', // Notebook
            nombre_producto: item.productName,
            cantidad: Number(item.quantity),
            precio_unitario: Number(item.unitPrice),
            cantidad_recibida: 0,
          }))
        }
      },
      include: {
        Detalle_OC: true,
        Proveedor: true,
      }
    });
  }

  @Get('sended')
  async getSended() {
    return await comprasClient.getSendedOrders();
  }

  @Get('ordenes')
  async getOrdenes() {
    return this.prisma.ordenCompra.findMany({
      include: {
        Detalle_OC: true,
        Proveedor: true,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: ActualizarCompraDto) {
    return await comprasClient.updateOrder(id, body);
  }
}

export default ComprasController;
