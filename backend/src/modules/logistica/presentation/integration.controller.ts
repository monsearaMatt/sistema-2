import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { MaestrosService } from '../application/maestros.service';
import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../../common/auth/jwt-auth.guard';
import { Roles } from '../../../common/auth/roles.decorator';
import { RolesGuard } from '../../../common/auth/roles.guard';

class CreatePickingFromMaestroDto {
  @Type(() => Number)
  @IsInt()
  id_cliente!: number;

  @IsUUID()
  id_producto!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_empleado?: number;
}

@Controller('logistica/integrations')
@UsePipes(new ValidationPipe({ transform: true }))
export class IntegrationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly maestros: MaestrosService,
  ) {}

  @Post('create-picking-from-maestro')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Jefe de Logística', 'Admin Sistema')
  async createFromMaestro(@Body() dto: CreatePickingFromMaestroDto) {
    // Validate cliente and producto exist
    const cliente = await this.maestros.getCliente(dto.id_cliente);
    const producto = await this.maestros.getProducto(dto.id_producto);

    // Optional: validate empleado exists
    if (dto.id_empleado) {
      const emp = await this.prisma.rRHH_empleado.findUnique({
        where: { id_empleado: dto.id_empleado },
      });
      if (!emp) throw new Error('Empleado no encontrado');
    }

    // Create a picking linked to the empleado (optional)
    const picking = await this.prisma.log_picking.create({
      data: {
        id_pedido_venta: null,
        id_empleado: dto.id_empleado ?? null,
        estado: 'Pendiente',
      },
    });

    return {
      picking,
      cliente,
      producto,
      note: 'Integración cross-module: picking creado usando datos maestros y empleado RRHH',
    };
  }
}
