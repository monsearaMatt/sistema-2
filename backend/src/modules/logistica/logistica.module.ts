// File: src/modules/logistica/logistica.module.ts
// Módulo Logistica que agrupa controladores y servicios
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { DireccionController } from './presentation/direccion.controller';
import { DireccionService } from './application/direccion.service';
import { TransportistaController } from './presentation/transportista.controller';
import { TransportistaService } from './application/transportista.service';
import { PickingController } from './presentation/picking.controller';
import { PickingService } from './application/picking.service';
import { GuiaController } from './presentation/guia.controller';
import { GuiaService } from './application/guia.service';
import { KpiController } from './presentation/kpi.controller';
import { KpiService } from './application/kpi.service';
import { ComprasController } from './presentation/compras.controller';
import ComprasClient from './infrastructure/compras.client';
import { MaestrosController } from './presentation/maestros.controller';
import { MaestrosService } from './application/maestros.service';
import { IntegrationController } from './presentation/integration.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    DireccionController,
    TransportistaController,
    PickingController,
    GuiaController,
    KpiController,
    ComprasController,
    MaestrosController,
    IntegrationController,
  ],
  providers: [
    DireccionService,
    TransportistaService,
    PickingService,
    GuiaService,
    KpiService,
    MaestrosService,
    { provide: 'COMPRAS_CLIENT', useValue: new ComprasClient() },
  ],
  exports: [],
})
export class LogisticaModule {}
