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
  useEmpleados,
  useMaestroClientes,
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
  const queryEmpleados = useEmpleados();
  const queryMaestroClientes = useMaestroClientes();

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

  const [searchTransportista, setSearchTransportista] = useState("");
  const [searchDireccion, setSearchDireccion] = useState("");
  const [searchPicking, setSearchPicking] = useState("");
  const [searchGuia, setSearchGuia] = useState("");

  const isLoading =
    queryTransportistas.isLoading ||
    queryDirecciones.isLoading ||
    queryPickings.isLoading ||
    queryGuias.isLoading ||
    queryEmpleados.isLoading ||
    queryMaestroClientes.isLoading;

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
  const empleados = (queryEmpleados.data ?? []) as { id_empleado: number; nombre: string; rut?: string }[];
  const maestroClientes = (queryMaestroClientes.data ?? []) as { id_cliente: number; nombre: string; rut?: string }[];

  const filteredTransportistas = useMemo(() => {
    return transportistas.filter(t =>
      (t.nombre_transp?.toLowerCase() || "").includes(searchTransportista.toLowerCase()) ||
      (t.patente_vehiculo?.toLowerCase() || "").includes(searchTransportista.toLowerCase())
    );
  }, [transportistas, searchTransportista]);

  const filteredDirecciones = useMemo(() => {
    return direcciones.filter(d =>
      (d.direccion?.toLowerCase() || "").includes(searchDireccion.toLowerCase())
    );
  }, [direcciones, searchDireccion]);

  const filteredPickings = useMemo(() => {
    return pickings.filter(p => {
      const empName = p.id_empleado ? (empleados.find(e => e.id_empleado === p.id_empleado)?.nombre || "") : "";
      return (
        String(p.id_ot ?? p.id).includes(searchPicking) ||
        (p.estado?.toLowerCase() || "").includes(searchPicking.toLowerCase()) ||
        empName.toLowerCase().includes(searchPicking.toLowerCase())
      );
    });
  }, [pickings, searchPicking, empleados]);

  const filteredGuias = useMemo(() => {
    return guias.filter(g => {
      const gId = String(g.id_guia ?? g.id);
      const otId = String(g.id_ot ?? g.log_picking?.id_ot ?? "");
      const transpId = g.id_transportista ?? g.log_transportista?.id_transportista;
      const transp = transportistas.find(t => (t.id_transportista ?? t.id) === transpId);
      const transpName = transp?.nombre_transp || "";
      const dirId = g.id_direccion ?? g.direccion?.id_direccion;
      const dir = direcciones.find(d => (d.id_direccion ?? d.id) === dirId);
      const dirStr = dir?.direccion || "";

      return (
        gId.includes(searchGuia) ||
        otId.includes(searchGuia) ||
        transpName.toLowerCase().includes(searchGuia.toLowerCase()) ||
        dirStr.toLowerCase().includes(searchGuia.toLowerCase())
      );
    });
  }, [guias, searchGuia, transportistas, direcciones]);

  const refreshAll = async () => {
    await Promise.all([
      queryTransportistas.refetch(),
      queryDirecciones.refetch(),
      queryPickings.refetch(),
      queryGuias.refetch(),
      queryEmpleados.refetch(),
      queryMaestroClientes.refetch(),
    ]);
  };

  const mutationError = (error: unknown) => {
    const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
    const message = err.response?.data?.message ?? err.message ?? "Error desconocido";
    return Array.isArray(message) ? message.join(", ") : message;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logística</h1>
            <p className="text-sm text-muted-foreground">Integración real con el backend de transportistas, direcciones, pickings y guías.</p>
          </div>
          <Button type="button" variant="outline" onClick={refreshAll}>
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
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={transportistaForm.id_empleado}
                onChange={(e) => setTransportistaForm((p) => ({ ...p, id_empleado: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar Empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id_empleado} value={emp.id_empleado} className="bg-background text-foreground">
                    {emp.nombre} (ID: {emp.id_empleado})
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              className="mt-3"
              disabled={crearTransportista.isPending || !transportistaForm.nombre_transp || !transportistaForm.patente_vehiculo || !transportistaForm.id_empleado}
              onClick={() =>
                crearTransportista.mutate(
                  { nombre_transp: transportistaForm.nombre_transp, patente_vehiculo: transportistaForm.patente_vehiculo.toUpperCase(), id_empleado: Number(transportistaForm.id_empleado) },
                  { onSuccess: () => setTransportistaForm({ nombre_transp: "", patente_vehiculo: "", id_empleado: "" }) },
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Crear transportista
            </Button>
            {crearTransportista.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {mutationError(crearTransportista.error)}</p>
            )}
            <div className="mt-3">
              <Input
                placeholder="Buscar transportista..."
                className="h-8 text-xs bg-secondary/50"
                value={searchTransportista}
                onChange={(e) => setSearchTransportista(e.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2 max-h-72 overflow-auto">
              {filteredTransportistas.map((item) => (
                <div key={item.id_transportista ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{item.nombre_transp}</span>
                    <Badge variant="outline">{item.patente_vehiculo}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Empleado: {item.id_empleado ? (empleados.find(e => e.id_empleado === item.id_empleado)?.nombre ?? `#${item.id_empleado}`) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={MapPin} title="Direcciones" subtitle="POST /logistica/direcciones y GET /logistica/direcciones" />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="Dirección" value={direccionForm.direccion} onChange={(e) => setDireccionForm((p) => ({ ...p, direccion: e.target.value }))} />
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={direccionForm.id_cliente}
                onChange={(e) => setDireccionForm((p) => ({ ...p, id_cliente: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar Cliente</option>
                {maestroClientes.map((cli) => (
                  <option key={cli.id_cliente} value={cli.id_cliente} className="bg-background text-foreground">
                    {cli.nombre} (ID: {cli.id_cliente})
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              className="mt-3"
              disabled={crearDireccion.isPending || !direccionForm.direccion || !direccionForm.id_cliente}
              onClick={() =>
                crearDireccion.mutate(
                  { direccion: direccionForm.direccion, id_cliente: Number(direccionForm.id_cliente) },
                  { onSuccess: () => setDireccionForm({ direccion: "", id_cliente: "" }) },
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Crear dirección
            </Button>
            {crearDireccion.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {mutationError(crearDireccion.error)}</p>
            )}
            <div className="mt-3">
              <Input
                placeholder="Buscar dirección..."
                className="h-8 text-xs bg-secondary/50"
                value={searchDireccion}
                onChange={(e) => setSearchDireccion(e.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2 max-h-72 overflow-auto">
              {filteredDirecciones.map((item) => (
                <div key={item.id_direccion ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                  <p className="font-medium text-foreground">{item.direccion}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cliente: {item.id_cliente ? (maestroClientes.find(c => c.id_cliente === item.id_cliente)?.nombre ?? `#${item.id_cliente}`) : "—"}
                  </p>
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
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={pickingForm.estado}
                onChange={(e) => setPickingForm((p) => ({ ...p, estado: e.target.value }))}
              >
                <option value="Pendiente" className="bg-background text-foreground">Pendiente</option>
                <option value="En Proceso" className="bg-background text-foreground">En Proceso</option>
                <option value="Completado" className="bg-background text-foreground">Completado</option>
              </select>
              <Button
                type="button"
                onClick={() =>
                  crearPicking.mutate(
                    { id_pedido_venta: pickingForm.id_pedido_venta ? Number(pickingForm.id_pedido_venta) : undefined, estado: pickingForm.estado as 'Pendiente' | 'En Proceso' | 'Completado' },
                    { onSuccess: () => setPickingForm({ id_pedido_venta: "", estado: "Pendiente" }) },
                  )
                }
                disabled={crearPicking.isPending}
              >
                <Plus className="mr-2 h-4 w-4" /> Crear picking
              </Button>
              {crearPicking.isError && (
                <p className="mt-2 text-sm text-red-500">Error: {mutationError(crearPicking.error)}</p>
              )}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={pickingAccionForm.id_ot}
                onChange={(e) => setPickingAccionForm((p) => ({ ...p, id_ot: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar OT (Picking)</option>
                {pickings.map((p) => (
                  <option key={p.id_ot ?? p.id} value={p.id_ot ?? p.id} className="bg-background text-foreground">
                    OT #{p.id_ot ?? p.id} ({p.estado})
                  </option>
                ))}
              </select>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={pickingAccionForm.id_empleado}
                onChange={(e) => setPickingAccionForm((p) => ({ ...p, id_empleado: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar Empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id_empleado} value={emp.id_empleado} className="bg-background text-foreground">
                    {emp.nombre} (ID: {emp.id_empleado})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                disabled={asignarPicking.isPending || !pickingAccionForm.id_ot || !pickingAccionForm.id_empleado}
                onClick={() =>
                  asignarPicking.mutate(
                    { id: Number(pickingAccionForm.id_ot), id_empleado: Number(pickingAccionForm.id_empleado) },
                    { onSuccess: () => setPickingAccionForm({ id_ot: "", id_empleado: "" }) },
                  )
                }
              >
                Asignar
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={completarPicking.isPending || !pickingAccionForm.id_ot}
                onClick={() => completarPicking.mutate(Number(pickingAccionForm.id_ot))}
              >
                Completar
              </Button>
              {(asignarPicking.isError || completarPicking.isError) && (
                <p className="mt-2 text-sm text-red-500">Error: {mutationError(asignarPicking.error ?? completarPicking.error)}</p>
              )}
            </div>
            <div className="mt-3">
              <Input
                placeholder="Buscar picking (OT, estado, empleado)..."
                className="h-8 text-xs bg-secondary/50"
                value={searchPicking}
                onChange={(e) => setSearchPicking(e.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2 max-h-80 overflow-auto">
              {filteredPickings.map((item) => (
                <div key={item.id_ot ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">OT #{item.id_ot ?? item.id}</span>
                    <Badge>{item.estado}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pedido venta: {item.id_pedido_venta ?? "—"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground font-medium">Asignar empleado:</span>
                      <select
                        className="h-7 rounded border border-input bg-transparent dark:bg-input/30 px-2 py-0.5 text-xs text-foreground outline-none"
                        value={item.id_empleado ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            asignarPicking.mutate({ id: item.id_ot ?? item.id!, id_empleado: Number(val) });
                          }
                        }}
                      >
                        <option value="" className="bg-background">Sin asignar</option>
                        {empleados.map((emp) => (
                          <option key={emp.id_empleado} value={emp.id_empleado} className="bg-background">
                            {emp.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    {item.estado !== "Completado" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2 hover:bg-primary/10 hover:text-primary transition-all"
                        disabled={completarPicking.isPending}
                        onClick={() => completarPicking.mutate(item.id_ot ?? item.id!)}
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={FileText} title="Guías" subtitle="POST /logistica/guias y GET /logistica/guias" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={guiaForm.id_ot}
                onChange={(e) => setGuiaForm((p) => ({ ...p, id_ot: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar OT (Picking)</option>
                {pickings.map((p) => (
                  <option key={p.id_ot ?? p.id} value={p.id_ot ?? p.id} className="bg-background text-foreground">
                    OT #{p.id_ot ?? p.id} ({p.estado})
                  </option>
                ))}
              </select>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={guiaForm.id_transportista}
                onChange={(e) => setGuiaForm((p) => ({ ...p, id_transportista: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar Transportista</option>
                {transportistas.map((t) => (
                  <option key={t.id_transportista ?? t.id} value={t.id_transportista ?? t.id} className="bg-background text-foreground">
                    {t.nombre_transp} ({t.patente_vehiculo})
                  </option>
                ))}
              </select>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                value={guiaForm.id_direccion}
                onChange={(e) => setGuiaForm((p) => ({ ...p, id_direccion: e.target.value }))}
              >
                <option value="" className="bg-background text-foreground">Seleccionar Dirección</option>
                {direcciones.map((d) => (
                  <option key={d.id_direccion ?? d.id} value={d.id_direccion ?? d.id} className="bg-background text-foreground">
                    {d.direccion}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              className="mt-3"
              disabled={crearGuia.isPending || !guiaForm.id_ot || !guiaForm.id_transportista || !guiaForm.id_direccion}
              onClick={() =>
                crearGuia.mutate(
                  { id_ot: Number(guiaForm.id_ot), id_transportista: Number(guiaForm.id_transportista), id_direccion: Number(guiaForm.id_direccion) },
                  { onSuccess: () => setGuiaForm({ id_ot: "", id_transportista: "", id_direccion: "" }) },
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Crear guía
            </Button>
            {crearGuia.isError && (
              <p className="mt-2 text-sm text-red-500">Error: {mutationError(crearGuia.error)}</p>
            )}
            <div className="mt-3">
              <Input
                placeholder="Buscar guía (Nº Guía, OT, transportista, dirección)..."
                className="h-8 text-xs bg-secondary/50"
                value={searchGuia}
                onChange={(e) => setSearchGuia(e.target.value)}
              />
            </div>
            <div className="mt-3 space-y-2 max-h-80 overflow-auto">
              {filteredGuias.map((item) => {
                const transpId = item.id_transportista ?? item.log_transportista?.id_transportista;
                const dirId = item.id_direccion ?? item.direccion?.id_direccion;
                const transp = transportistas.find((t) => (t.id_transportista ?? t.id) === transpId);
                const dir = direcciones.find((d) => (d.id_direccion ?? d.id) === dirId);

                return (
                  <div key={item.id_guia ?? item.id} className="rounded-lg border border-border bg-secondary p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">Guía #{item.id_guia ?? item.id}</span>
                      <Badge variant="outline">OT {item.id_ot ?? item.log_picking?.id_ot ?? "—"}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Transportista: {transp ? `${transp.nombre_transp} (${transp.patente_vehiculo})` : transpId ?? "—"} · Dirección: {dir ? dir.direccion : dirId ?? "—"}
                    </p>
                  </div>
                );
              })}
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