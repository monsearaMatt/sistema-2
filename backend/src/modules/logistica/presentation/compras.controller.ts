import { Controller, Get, Patch, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import ComprasClient from '../infrastructure/compras.client';
import { ActualizarCompraDto } from './dto/actualizar-compra.dto';

const comprasClient = new ComprasClient();

@Controller('logistica/compras')
@UsePipes(new ValidationPipe({ transform: true }))
export class ComprasController {
  @Get('sended')
  async getSended() {
    return await comprasClient.getSendedOrders();
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: ActualizarCompraDto) {
    return await comprasClient.updateOrder(id, body);
  }
}

export default ComprasController;
