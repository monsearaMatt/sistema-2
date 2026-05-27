// File: src/modules/logistica/presentation/dto/crear-direccion.dto.ts
// DTO para crear una dirección en el módulo Logistica
import { IsInt, IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearDireccionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  id_cliente: number;
}
