import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsEmail,
  Matches,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearEmpleadoDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}-[\dkK]$/, {
    message: 'Formato de RUT inválido (ej: 12345678-9)',
  })
  rut: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_rol: number;

  @IsOptional()
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVO', 'INACTIVO', 'LICENCIA', 'Activo', 'Inactivo', 'Licencia'])
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
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVO', 'INACTIVO', 'LICENCIA', 'Activo', 'Inactivo', 'Licencia'])
  estado?: string;
}
