import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class MaestrosService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducto(id: string) {
    const producto = await this.prisma.maestro_producto.findUnique({
      where: { id_producto: id },
    });
    if (producto) return producto;

    const invProducto = await this.prisma.producto.findUnique({
      where: { id_producto: id },
    });
    if (!invProducto) throw new NotFoundException('Producto no encontrado');
    return invProducto;
  }

  async getCliente(id: number) {
    const cliente = await this.prisma.maestro_cliente.findUnique({
      where: { id_cliente: id },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async getProveedor(id: string) {
    const proveedor = await this.prisma.maestro_proveedor.findUnique({
      where: { id_proveedor: id },
    });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return proveedor;
  }

  async listClientes() {
    return this.prisma.maestro_cliente.findMany({ orderBy: { id_cliente: 'asc' } });
  }

  async listProductos() {
    const [catalogo, inventario] = await Promise.all([
      this.prisma.maestro_producto.findMany({ orderBy: { nombre: 'asc' } }),
      this.prisma.producto.findMany({ orderBy: { nombre: 'asc' } }),
    ]);
    return { catalogo, inventario };
  }

  async listProveedores() {
    return this.prisma.maestro_proveedor.findMany({ orderBy: { nombre: 'asc' } });
  }
}
