import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearEmpleadoDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  id_rol: number;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Activo', 'Inactivo', 'Licencia'])
  estado?: string;
}

export class ActualizarEmpleadoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_rol?: number;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Activo', 'Inactivo', 'Licencia'])
  estado?: string;
}
