import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Controller('logistica/ventas')
export class VentasController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('pedidos')
  async getPedidos() {
    return this.prisma.ventas_pedido.findMany({
      include: {
        ventas_detalle: true,
        clientes: true,
      },
      orderBy: { id_pedido: 'desc' },
    });
  }
}
