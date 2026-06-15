import {
  IsInt,
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsPositive,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSolicitudDto {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_empleado: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Vacaciones', 'Permiso', 'Licencia'], {
    message: 'Tipo de solicitud inválido',
  })
  tipo_solicitud: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  fecha_inicio: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  fecha_fin: string;

  @IsOptional()
  @IsString()
  @IsIn(['PENDIENTE', 'APROBADA', 'RECHAZADA'])
  estado?: string;
}

export class ActualizarSolicitudDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Vacaciones', 'Permiso', 'Licencia'])
  tipo_solicitud?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  fecha_inicio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  fecha_fin?: string;

  @IsDefined()
  @IsString()
  @IsIn(['PENDIENTE', 'APROBADA', 'RECHAZADA'])
  estado: string;
}
