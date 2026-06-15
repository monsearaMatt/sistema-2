import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import ComprasClient from '../infrastructure/compras.client';
import { ActualizarCompraDto } from './dto/actualizar-compra.dto';

const comprasClient = new ComprasClient();

@Controller('logistica/compras')
@UsePipes(new ValidationPipe({ transform: true }))
export class ComprasController {
  constructor(private readonly prisma: PrismaService) {}

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
  async updateOrder(
    @Param('id') id: string,
    @Body() body: ActualizarCompraDto,
  ) {
    return await comprasClient.updateOrder(id, body);
  }
}

export default ComprasController;
