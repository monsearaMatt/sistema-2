"use client";

import { useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import {
  AlertCircle,
  ClipboardList,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useAsignarPicking,
  useCompletarPicking,
  useCrearDireccion,
  useCrearGuia,
  useCrearPicking,
  useCrearTransportista,
  useDirecciones,
  useGuias,
  usePickings,
  useTransportistas,
} from "@/src/hooks/logistica";

function SectionTitle({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-4">{children}</div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

interface TransportistaApi {
  id_transportista?: number;
  id?: number;
  nombre_transp?: string;
  patente_vehiculo?: string;
  id_empleado?: number;
}

interface DireccionApi {
  id_direccion?: number;
  id?: number;
  direccion?: string;
  id_cliente?: number;
}

interface PickingApi {
  id_ot?: number;
  id?: number;
  id_pedido_venta?: number;
  estado?: string;
  id_empleado?: number;
}

interface GuiaApi {
  id_guia?: number;
  id?: number;
  id_ot?: number;
  id_transportista?: number;
  id_direccion?: number;
  log_picking?: { id_ot?: number };
  log_transportista?: { id_transportista?: number };
  direccion?: { id_direccion?: number };
}

export default function LogisticaPage() {
  const queryTransportistas = useTransportistas();
  const queryDirecciones = useDirecciones();
  const queryPickings = usePickings();
  const queryGuias = useGuias();

  const crearTransportista = useCrearTransportista();
  const crearDireccion = useCrearDireccion();
  const crearPicking = useCrearPicking();
  const crearGuia = useCrearGuia();
  const asignarPicking = useAsignarPicking();
  const completarPicking = useCompletarPicking();

  const [transportistaForm, setTransportistaForm] = useState({ nombre_transp: "", patente_vehiculo: "", id_empleado: "" });
  const [direccionForm, setDireccionForm] = useState({ direccion: "", id_cliente: "" });
  const [pickingForm, setPickingForm] = useState({ id_pedido_venta: "", estado: "Pendiente" });
  const [guiaForm, setGuiaForm] = useState({ id_ot: "", id_transportista: "", id_direccion: "" });
  const [pickingAccionForm, setPickingAccionForm] = useState({ id_ot: "", id_empleado: "" });

  const isLoading = queryTransportistas.isLoading || queryDirecciones.isLoading || queryPickings.isLoading || queryGuias.isLoading;

  const stats = useMemo(
    () => ({
      transportistas: queryTransportistas.data?.length ?? 0,
      direcciones: queryDirecciones.data?.length ?? 0,
      pickings: queryPickings.data?.length ?? 0,
      guias: queryGuias.data?.length ?? 0,
    }),
    [queryTransportistas.data, queryDirecciones.data, queryPickings.data, queryGuias.data],
  );

  const transportistas = (queryTransportistas.data ?? []) as TransportistaApi[];
  const direcciones = (queryDirecciones.data ?? []) as DireccionApi[];
  const pickings = (queryPickings.data ?? []) as PickingApi[];
  const guias = (queryGuias.data ?? []) as GuiaApi[];

  const refreshAll = async () => {
    await Promise.all([
      queryTransportistas.refetch(),
      queryDirecciones.refetch(),
      queryPickings.refetch(),
      queryGuias.refetch(),
    ]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logística</h1>
            <p className="text-sm text-muted-foreground">Integración real con el backend de transportistas, direcciones, pickings y guías.</p>
          </div>
          <Button variant="outline" onClick={refreshAll}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refrescar
          </Button>
        </div>

        {isLoading && <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Cargando datos de logística...</div>}

        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Transportistas" value={stats.transportistas} />
          <Stat label="Direcciones" value={stats.direcciones} />
          <Stat label="Pickings" value={stats.pickings} />
          <Stat label="Guías" value={stats.guias} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionTitle icon={Truck} title="Transportistas" subtitle="POST /logistica/transportistas y GET /logistica/transportistas" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input placeholder="Nombre" value={transportistaForm.nombre_transp} onChange={(e) => setTransportistaForm((p) => ({ ...p, nombre_transp: e.target.value }))} />
              <Input placeholder="Patente" value={transportistaForm.patente_vehiculo} onChange={(e) => setTransportistaForm((p) => ({ ...p, patente_vehiculo: e.target.value }))} />
              <Input placeholder="ID empleado" type="number" value={transportistaForm.id_empleado} onChange={(e) => setTransportistaForm((p) => ({ ...p, id_empleado: e.target.value }))} />
            </div>
            <Button
              className="mt-3"
              disabled={crearTransportista.isLoading || !transportistaForm.nombre_transp || !transportistaForm.patente_vehiculo || !transportistaForm.id_empleado}
              onClick={() =>
                crearTransportista.mutate(
                  { nombre_transp: transportistaForm.nombre_transp, patente_vehiculo: transportistaForm.patente_vehiculo.toUpperCase(), id_empleado: Number(transportistaForm.id_empleado) },
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Crear transportista
            </Button>
            {crearTransportista.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {(crearTransportista.error as any)?.response?.data?.message ?? (crearTransportista.error as any)?.message}</p>
            )}
            <div className="mt-4 space-y-2 max-h-72 overflow-auto">
              {transportistas.map((item) => (
                <div key={item.id_transportista ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{item.nombre_transp}</span>
                    <Badge variant="outline">{item.patente_vehiculo}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Empleado: {item.id_empleado ?? "—"}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={MapPin} title="Direcciones" subtitle="POST /logistica/direcciones y GET /logistica/direcciones" />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="Dirección" value={direccionForm.direccion} onChange={(e) => setDireccionForm((p) => ({ ...p, direccion: e.target.value }))} />
              <Input placeholder="ID cliente" type="number" value={direccionForm.id_cliente} onChange={(e) => setDireccionForm((p) => ({ ...p, id_cliente: e.target.value }))} />
            </div>
            <Button
              className="mt-3"
              disabled={crearDireccion.isLoading || !direccionForm.direccion || !direccionForm.id_cliente}
              onClick={() => crearDireccion.mutate({ direccion: direccionForm.direccion, id_cliente: Number(direccionForm.id_cliente) })}
            >
              <Plus className="mr-2 h-4 w-4" /> Crear dirección
            </Button>
            {crearDireccion.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {(crearDireccion.error as any)?.response?.data?.message ?? (crearDireccion.error as any)?.message}</p>
            )}
            <div className="mt-4 space-y-2 max-h-72 overflow-auto">
              {direcciones.map((item) => (
                <div key={item.id_direccion ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <p className="font-medium text-foreground">{item.direccion}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Cliente: {item.id_cliente ?? "—"}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionTitle icon={ClipboardList} title="Pickings" subtitle="POST, PATCH /assign y PATCH /complete" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input placeholder="ID pedido venta" type="number" value={pickingForm.id_pedido_venta} onChange={(e) => setPickingForm((p) => ({ ...p, id_pedido_venta: e.target.value }))} />
              <Input placeholder="Estado" value={pickingForm.estado} onChange={(e) => setPickingForm((p) => ({ ...p, estado: e.target.value }))} />
              <Button
                onClick={() =>
                  crearPicking.mutate({ id_pedido_venta: pickingForm.id_pedido_venta ? Number(pickingForm.id_pedido_venta) : undefined, estado: pickingForm.estado as 'Pendiente' | 'En Proceso' | 'Completado' })
                }
                disabled={crearPicking.isLoading}
              >
                <Plus className="mr-2 h-4 w-4" /> Crear picking
              </Button>
              {crearPicking.isError && (
                <p className="mt-2 text-sm text-red-500">Error: {(crearPicking.error as any)?.response?.data?.message ?? (crearPicking.error as any)?.message}</p>
              )}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="ID OT" type="number" value={pickingAccionForm.id_ot} onChange={(e) => setPickingAccionForm((p) => ({ ...p, id_ot: e.target.value }))} />
              <Input placeholder="ID empleado" type="number" value={pickingAccionForm.id_empleado} onChange={(e) => setPickingAccionForm((p) => ({ ...p, id_empleado: e.target.value }))} />
              <Button variant="outline" disabled={asignarPicking.isLoading} onClick={() => asignarPicking.mutate({ id: Number(pickingAccionForm.id_ot), id_empleado: Number(pickingAccionForm.id_empleado) })}>Asignar</Button>
              <Button variant="outline" disabled={completarPicking.isLoading} onClick={() => completarPicking.mutate(Number(pickingAccionForm.id_ot))}>Completar</Button>
              {(asignarPicking.isError || completarPicking.isError) && (
                <p className="mt-2 text-sm text-red-500">Error: {(asignarPicking.error as any)?.response?.data?.message ?? (completarPicking.error as any)?.response?.data?.message ?? (asignarPicking.error as any)?.message ?? (completarPicking.error as any)?.message}</p>
              )}
            </div>
            <div className="mt-4 space-y-2 max-h-80 overflow-auto">
              {pickings.map((item) => (
                <div key={item.id_ot ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">OT #{item.id_ot ?? item.id}</span>
                    <Badge>{item.estado}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Pedido venta: {item.id_pedido_venta ?? "—"} · Empleado: {item.id_empleado ?? "—"}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={FileText} title="Guías" subtitle="POST /logistica/guias y GET /logistica/guias" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input placeholder="ID OT" type="number" value={guiaForm.id_ot} onChange={(e) => setGuiaForm((p) => ({ ...p, id_ot: e.target.value }))} />
              <Input placeholder="ID transportista" type="number" value={guiaForm.id_transportista} onChange={(e) => setGuiaForm((p) => ({ ...p, id_transportista: e.target.value }))} />
              <Input placeholder="ID dirección" type="number" value={guiaForm.id_direccion} onChange={(e) => setGuiaForm((p) => ({ ...p, id_direccion: e.target.value }))} />
            </div>
            <Button
              className="mt-3"
              disabled={crearGuia.isLoading || !guiaForm.id_ot || !guiaForm.id_transportista || !guiaForm.id_direccion}
              onClick={() => crearGuia.mutate({ id_ot: Number(guiaForm.id_ot), id_transportista: Number(guiaForm.id_transportista), id_direccion: Number(guiaForm.id_direccion) })}
            >
              <Plus className="mr-2 h-4 w-4" /> Crear guía
            </Button>
            {crearGuia.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {(crearGuia.error as any)?.response?.data?.message ?? (crearGuia.error as any)?.message}</p>
            )}
            <div className="mt-4 space-y-2 max-h-80 overflow-auto">
              {guias.map((item) => (
                <div key={item.id_guia ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">Guía #{item.id_guia ?? item.id}</span>
                    <Badge variant="outline">OT {item.id_ot ?? item.log_picking?.id_ot ?? "—"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Transportista: {item.id_transportista ?? item.log_transportista?.id_transportista ?? "—"} · Dirección: {item.id_direccion ?? item.direccion?.id_direccion ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {(queryTransportistas.error || queryDirecciones.error || queryPickings.error || queryGuias.error) && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Revisa `NEXT_PUBLIC_API_URL` y que el backend de logística esté en ejecución.</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}