import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MaestrosService } from '../application/maestros.service';

@Controller('logistica/maestros')
export class MaestrosController {
  constructor(private readonly maestros: MaestrosService) {}

  @Get('clientes')
  async listClientes() {
    return this.maestros.listClientes();
  }

  @Get('productos')
  async listProductos() {
    return this.maestros.listProductos();
  }

  @Get('proveedores')
  async listProveedores() {
    return this.maestros.listProveedores();
  }

  @Get('producto/:id')
  async getProducto(@Param('id') id: string) {
    return this.maestros.getProducto(id);
  }

  @Get('cliente/:id')
  async getCliente(@Param('id', ParseIntPipe) id: number) {
    return this.maestros.getCliente(id);
  }

  @Get('proveedor/:id')
  async getProveedor(@Param('id') id: string) {
    return this.maestros.getProveedor(id);
  }
}
