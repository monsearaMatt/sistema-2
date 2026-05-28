import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { EmpleadoController } from './presentation/empleado.controller';
import { EmpleadoService } from './application/empleado.service';
import { RolController } from './presentation/rol.controller';
import { RolService } from './application/rol.service';
import { SolicitudController } from './presentation/solicitud.controller';
import { SolicitudService } from './application/solicitud.service';

@Module({
  imports: [PrismaModule],
  controllers: [EmpleadoController, RolController, SolicitudController],
  providers: [EmpleadoService, RolService, SolicitudService],
  exports: [],
})
export class RrhhModule {}
