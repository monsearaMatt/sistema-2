// File: src/modules/logistica/presentation/kpi.controller.ts
// Controller para KPIs del módulo Logistica
import { Controller, Get } from '@nestjs/common';
import { KpiService } from '../application/kpi.service';

@Controller('logistica/kpis')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('productividad')
  async productividad() {
    return this.kpiService.productividadPorEmpleado();
  }

  @Get('tiempo-despacho')
  async tiempoDespacho() {
    return this.kpiService.tiempoMedioDespacho();
  }
}
