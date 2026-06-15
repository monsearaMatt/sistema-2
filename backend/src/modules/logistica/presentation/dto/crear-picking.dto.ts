// File: src/modules/logistica/presentation/dto/crear-picking.dto.ts
// DTO para crear y actualizar picking (log_picking)
import { IsInt, IsOptional, IsPositive, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPickingDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_pedido_venta?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Pendiente', 'En Proceso', 'Completado'])
  estado?: string;
}
