// File: src/modules/logistica/presentation/dto/crear-guia-despacho.dto.ts
// DTO para crear una guía de despacho (log_guia_despacho)
import { IsInt, IsDefined, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearGuiaDespachoDto {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_ot!: number;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_transportista!: number;

  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_direccion!: number;
}
