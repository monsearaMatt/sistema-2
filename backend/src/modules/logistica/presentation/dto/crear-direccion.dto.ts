// File: src/modules/logistica/presentation/dto/crear-direccion.dto.ts
// DTO para crear una dirección en el módulo Logistica
import { IsInt, IsString, IsNotEmpty, IsDefined, Length, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearDireccionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  direccion!: string;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_cliente!: number;
}
