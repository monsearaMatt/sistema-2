import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { EmpleadoController } from './presentation/empleado.controller';
import { EmpleadoService } from './application/empleado.service';
import { RolController } from './presentation/rol.controller';
import { RolService } from './application/rol.service';
import { SolicitudController } from './presentation/solicitud.controller';
import { SolicitudService } from './application/solicitud.service';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    EmpleadoController,
    RolController,
    SolicitudController,
    AuthController,
  ],
  providers: [EmpleadoService, RolService, SolicitudService, AuthService],
  exports: [AuthService],
})
export class RrhhModule {}
