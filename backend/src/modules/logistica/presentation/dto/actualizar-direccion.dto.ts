import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarDireccionDto {
  @IsString()
  @IsOptional()
  direccion?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  id_cliente?: number;
}
