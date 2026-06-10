import { IsInt, IsUUID, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearRecepcionDto {
  @IsUUID()
  id_orden_compra!: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_empleado!: number;
}
