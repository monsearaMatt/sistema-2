import {
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetalleRecibidoDto {
  @IsString()
  id_producto: string;

  @IsOptional()
  @IsNumber()
  cantidad_recibida?: number;
}

export class ActualizarCompraDto {
  @IsString()
  @IsIn(['APROBADA', 'RECHAZADA', 'ENVIADA'])
  estado: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleRecibidoDto)
  detalles?: DetalleRecibidoDto[];
}
