import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSolicitudDto {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  id_empleado: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  tipo_solicitud: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  fecha_fin: string;

  @IsOptional()
  @IsString()
  @IsIn(['Pendiente', 'Aprobada', 'Rechazada'])
  estado?: string;
}

export class ActualizarSolicitudDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tipo_solicitud?: string;

  @IsOptional()
  @IsString()
  fecha_inicio?: string;

  @IsOptional()
  @IsString()
  fecha_fin?: string;

  @IsDefined()
  @IsString()
  @IsIn(['Pendiente', 'Aprobada', 'Rechazada'])
  estado: string;
}
