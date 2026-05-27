// File: src/modules/logistica/application/kpi.service.ts
// Servicio para KPIs: productividad y tiempo medio de despacho
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async productividadPorEmpleado() {
    // Contar pickings completados por id_empleado
    const rows = await this.prisma.log_picking.groupBy({
      by: ['id_empleado'],
      where: { estado: 'Completado' },
      _count: {
        _all: true,
      },
    });

    return rows.map(r => ({ id_empleado: r.id_empleado, completados: r._count?._all ?? 0 }));
  }

  async tiempoMedioDespacho() {
    // Usamos una consulta SQL para calcular la diferencia en segundos y promediarla
    const result: any = await this.prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM (g.fecha_emision - p.fecha_creacion))) as avg_seconds
      FROM "Logistica"."log_guia_despacho" g
      JOIN "Logistica"."log_picking" p ON g.id_ot = p.id_ot
      WHERE g.fecha_emision IS NOT NULL AND p.fecha_creacion IS NOT NULL
    `;

    // Resultado depende del driver; normalizar
    const avgSeconds = result?.[0]?.avg_seconds ?? result?.avg_seconds ?? null;
    return { avg_seconds: avgSeconds, avg_hours: avgSeconds != null ? avgSeconds / 3600 : null };
  }
}
