import { IsString, IsOptional, IsInt, Length, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarTransportistaDto {
  @IsString()
  @IsOptional()
  nombre_transp?: string;

  @IsString()
  @IsOptional()
  @Length(6, 8)
  patente_vehiculo?: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  id_empleado?: number;
}
