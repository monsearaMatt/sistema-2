import { IsString, IsNotEmpty } from 'class-validator';

export class CrearRolDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  name_rol: string;
}
