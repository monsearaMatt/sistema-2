// File: src/modules/logistica/presentation/dto/crear-transportista.dto.ts
// DTO para crear un transportista en el módulo Logistica
import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearTransportistaDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  nombre_transp!: string;

  @IsDefined()
  @IsString()
  @Length(6, 8)
  @Matches(/^[A-Z0-9]{6,8}$/, {
    message: 'patente_vehiculo debe contener solo letras mayúsculas y dígitos',
  })
  patente_vehiculo!: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_empleado!: number;
}
