// File: src/modules/logistica/presentation/dto/crear-transportista.dto.ts
// DTO para crear un transportista en el módulo Logistica
import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearTransportistaDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  nombre_transp: string;

  @IsDefined()
  @IsString()
  @Length(6, 8)
  patente_vehiculo: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  id_empleado: number;
}
