"use client";

/**
 * LogisticaPage.tsx — Módulo de Logística / Despacho
 *
 * Este archivo contiene SOLO lógica de UI.
 * Toda la capa de datos (tipos, mocks, hooks, llamadas API) vive en:
 *   @/hooks/logistica/logisticaHooks
 *
 * Para alternar entre mock y backend real:
 *   → editar USE_MOCK / USE_MOCK_VENTAS en logisticaHooks.ts
 */

import { useState, useEffect } from "react";
import {
  useOrdenesCompra,
  useRegistrarRecepcion,
  useRecepciones,
  useOrdenesVenta,
  useOTsPicking,
  useCrearOT,
  useActualizarEstadoOT,
  useCrearGuia,
  useGuiasDespacho,
  useTransportistas,
  useDirecciones,
  useOperadores,
  USE_MOCK_VENTAS,
  type OrdenCompra,
  type OrdenVenta,
  type OTPicking,
  type GuiaDespacho,
  type Recepcion,
  type Transportista,
  type RegistrarRecepcionDto,
} from "../../hooks/logistica/logisticahooks";
import {
  Truck, Package, ClipboardList, ArrowDownToLine, Search,
  Plus, Check, X, MoreHorizontal, CheckCircle2,
  Filter, CalendarDays, User, MapPin, ShieldAlert,
  PhoneCall, ReceiptText, ChevronRight, Building2,
  ArrowUpFromLine, PackageCheck, Info,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Input }   from "@/components/ui/input";
import { Badge }   from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const badgeOT = (e: OTPicking["estado"]) => {
  const m: Record<OTPicking["estado"], [string, string]> = {
    PENDIENTE:  ["bg-yellow-500/15 text-yellow-500 border-yellow-500/20", "Pendiente"],
    EN_PROCESO: ["bg-blue-500/15 text-blue-400 border-blue-500/20",       "En Proceso"],
    COMPLETADA: ["bg-green-500/15 text-green-500 border-green-500/20",    "Completada"],
    CANCELADA:  ["bg-red-500/15 text-red-500 border-red-500/20",          "Cancelada"],
  };
  return <Badge className={m[e][0]}>{m[e][1]}</Badge>;
};

const fmt = (n: number) => `$${n.toLocaleString("es-CL")}`;

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── MODAL: Crear OT de Picking (F-LOG-01) ────────────────────────────────────

function ModalCrearOT({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: ovs = [],       isLoading: loadOvs } = useOrdenesVenta();
  const { data: operadores = []                    } = useOperadores();
  const crear = useCrearOT(() => onClose());

  const [paso,     setPaso]     = useState<1 | 2>(1);
  const [ovSel,    setOvSel]    = useState<OrdenVenta | null>(null);
  const [operador, setOperador] = useState("");
  const [err,      setErr]      = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) { setPaso(1); setOvSel(null); setOperador(""); setErr({}); }
  }, [open]);

  const handleCrear = () => {
    const e: Record<string, string> = {};
    if (!operador) e.op = "Requerido";
    setErr(e);
    if (Object.keys(e).length || !ovSel) return;
    crear.mutate({ id_pedido_venta: ovSel.id_pedido_venta, id_empleado: operador });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ClipboardList className="w-5 h-5 text-primary" />Nueva OT de Picking
          </DialogTitle>
        </DialogHeader>

        {USE_MOCK_VENTAS && (
          <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-500">
              Usando datos de demostración. Los pedidos reales vendrán del módulo de Ventas.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs">
          {["Seleccionar OV", "Asignar operador"].map((lbl, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className={`flex items-center gap-1 ${paso === i + 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs
                  ${paso === i + 1 ? "bg-primary text-primary-foreground border-primary"
                    : paso > i + 1 ? "bg-green-500 text-white border-green-500"
                    : "border-border"}`}>
                  {paso > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {lbl}
              </span>
            </span>
          ))}
        </div>

        {paso === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Selecciona el pedido de venta confirmado para crear la OT.
            </p>
            {loadOvs ? (
              <p className="text-center py-8 text-muted-foreground animate-pulse text-sm">
                Cargando órdenes de venta...
              </p>
            ) : ovs.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-sm">
                No hay órdenes de venta pendientes de despacho.
              </div>
            ) : ovs.map(ov => (
              <div key={ov.id_pedido_venta}
                onClick={() => setOvSel(ov)}
                className={`rounded-lg border p-4 cursor-pointer transition-all
                  ${ovSel?.id_pedido_venta === ov.id_pedido_venta
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent/30"}`}
              >
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold">{ov.id_pedido_venta}</span>
                    <p className="font-semibold text-foreground mt-0.5">{ov.cliente}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{ov.direccion_entrega}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ov.fecha_emision} · {ov.detalles.length} producto{ov.detalles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">{fmt(ov.monto_total)}</p>
                </div>
                <div className="mt-2 space-y-0.5">
                  {ov.detalles.map(d => (
                    <div key={d.id_producto} className="flex justify-between text-xs text-muted-foreground">
                      <span>{d.nombre_producto}</span>
                      <span>Cant: <span className="text-foreground font-medium">{d.cantidad}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {paso === 2 && ovSel && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">OV seleccionada</p>
              <p className="font-semibold text-foreground">{ovSel.id_pedido_venta} · {ovSel.cliente}</p>
              <p className="text-xs text-muted-foreground">
                {ovSel.detalles.length} productos · {fmt(ovSel.monto_total)}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Operador de Bodega *</label>
              <Select value={operador} onValueChange={setOperador}>
                <SelectTrigger className={err.op ? "border-red-500/50" : ""}>
                  <SelectValue placeholder="Seleccionar operador..." />
                </SelectTrigger>
                <SelectContent>
                  {operadores.map(o => (
                    <SelectItem key={o.id_empleado} value={o.id_empleado}>{o.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err.op && <p className="text-xs text-red-500">{err.op}</p>}
            </div>

            <div className="rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-400">
                Se registrará la referencia al pedido. El detalle de productos
                es gestionado por el módulo de Inventario.
              </p>
            </div>
          </div>
        )}

        {crear.isError && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-500">Error al crear la OT. Intenta nuevamente.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {paso === 1 && (
            <Button disabled={!ovSel} onClick={() => setPaso(2)}>
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {paso === 2 && (
            <>
              <Button variant="outline" onClick={() => setPaso(1)}>Atrás</Button>
              <Button onClick={handleCrear} disabled={crear.isPending}>
                {crear.isPending
                  ? "Creando..."
                  : <><CheckCircle2 className="w-4 h-4 mr-2" />Crear OT de Picking</>}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── MODAL: Emitir Guía de Despacho ──────────────────────────────────────────

function ModalEmitirGuia({ ot, open, onClose }: {
  ot: OTPicking | null; open: boolean; onClose: () => void;
}) {
  const { data: transportistas = [] } = useTransportistas();
  const { data: direcciones = []    } = useDirecciones();
  const crear = useCrearGuia(() => onClose());

  const [transportista, setTransportista] = useState("");
  const [direccion,     setDireccion]     = useState("");
  const [err,           setErr]           = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) { setTransportista(""); setDireccion(""); setErr({}); }
  }, [open]);

  if (!ot) return null;

  const handleEmitir = () => {
    const e: Record<string, string> = {};
    if (!transportista) e.trn = "Requerido";
    if (!direccion)     e.dir = "Requerido";
    setErr(e);
    if (Object.keys(e).length) return;
    crear.mutate({ id_ot: ot.id_ot, id_transportista: transportista, id_direccion: Number(direccion) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ReceiptText className="w-5 h-5 text-primary" />Emitir Guía de Despacho
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary p-3">
            <p className="text-xs text-muted-foreground">OT asociada</p>
            <p className="font-mono font-semibold text-foreground">{ot.id_ot}</p>
            <p className="text-xs text-muted-foreground">
              Pedido: {ot.id_pedido_venta} · Op: {ot.nombre_empleado}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Transportista *</label>
            <Select value={transportista} onValueChange={setTransportista}>
              <SelectTrigger className={err.trn ? "border-red-500/50" : ""}>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {transportistas.map(t => (
                  <SelectItem key={t.id_transportista} value={t.id_transportista}>
                    {t.nombre_transp} · {t.patente_vehiculo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err.trn && <p className="text-xs text-red-500">{err.trn}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Dirección de Entrega *</label>
            <Select value={direccion} onValueChange={setDireccion}>
              <SelectTrigger className={err.dir ? "border-red-500/50" : ""}>
                <SelectValue placeholder="Seleccionar dirección..." />
              </SelectTrigger>
              <SelectContent>
                {direcciones.map(d => (
                  <SelectItem key={d.id_direccion} value={String(d.id_direccion)}>
                    {d.direccion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err.dir && <p className="text-xs text-red-500">{err.dir}</p>}
          </div>

          <div className="rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-400">
              La guía quedará registrada como documento de referencia.
              El seguimiento se coordina directamente con el transportista.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleEmitir} disabled={crear.isPending}>
            {crear.isPending
              ? "Emitiendo..."
              : <><ReceiptText className="w-4 h-4 mr-2" />Emitir Guía</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── MODAL: Registrar Recepción (F-LOG-03) ────────────────────────────────────

function ModalRegistrarRecepcion({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: ocs = [],       isLoading: loadOcs } = useOrdenesCompra();
  const { data: operadores = []                    } = useOperadores();
  const registrar = useRegistrarRecepcion(() => onClose());

  const [paso,       setPaso]       = useState<1 | 2>(1);
  const [ocSel,      setOcSel]      = useState<OrdenCompra | null>(null);
  const [operador,   setOperador]   = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [err,        setErr]        = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) { setPaso(1); setOcSel(null); setOperador(""); setCantidades({}); setErr({}); }
  }, [open]);

  useEffect(() => {
    if (ocSel) {
      const init: Record<string, number> = {};
      ocSel.detalles.forEach(d => { init[d.id_producto] = d.cantidad; });
      setCantidades(init);
    }
  }, [ocSel]);

  const ocsPendientes = ocs.filter(oc => oc.estado === "ENVIADA");

  const hayDiscrepancia = ocSel?.detalles.some(d =>
    (cantidades[d.id_producto] ?? d.cantidad) !== d.cantidad
  ) ?? false;

  const handleRegistrar = () => {
    const e: Record<string, string> = {};
    if (!operador) e.op = "Requerido";
    setErr(e);
    if (Object.keys(e).length || !ocSel) return;

    const payload: RegistrarRecepcionDto = {
      id_orden_compra: ocSel.id,
      id_empleado: operador,
      detalles: ocSel.detalles.map(d => ({
        id_producto: d.id_producto,
        cantidad_recibida: cantidades[d.id_producto] ?? d.cantidad,
      })),
    };
    registrar.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ArrowDownToLine className="w-5 h-5 text-primary" />Registrar Recepción de Mercadería
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 text-xs">
          {["Seleccionar OC", "Verificar cantidades"].map((lbl, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className={`flex items-center gap-1 ${paso === i + 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs
                  ${paso === i + 1 ? "bg-primary text-primary-foreground border-primary"
                    : paso > i + 1 ? "bg-green-500 text-white border-green-500"
                    : "border-border"}`}>
                  {paso > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {lbl}
              </span>
            </span>
          ))}
        </div>

        {paso === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Órdenes de compra pendientes de recepción (datos en tiempo real del módulo Compras).
            </p>
            {loadOcs ? (
              <p className="text-center py-8 text-muted-foreground animate-pulse text-sm">
                Cargando órdenes de compra...
              </p>
            ) : ocsPendientes.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-sm">
                No hay órdenes de compra pendientes de recepción.
              </div>
            ) : ocsPendientes.map(oc => (
              <div key={oc.id}
                onClick={() => setOcSel(oc)}
                className={`rounded-lg border p-4 cursor-pointer transition-all
                  ${ocSel?.id === oc.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/30"}`}
              >
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold">
                      {oc.id.slice(0, 18)}...
                    </span>
                    <Badge className="ml-2 bg-yellow-500/15 text-yellow-500 border-yellow-500/20 text-xs">
                      {oc.estado}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(oc.fecha_creacion).toLocaleDateString("es-CL")} · {oc.detalles.length} producto{oc.detalles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">{fmt(oc.total)}</p>
                </div>
                <div className="mt-2 space-y-0.5">
                  {oc.detalles.map(d => (
                    <div key={d.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{d.nombre_producto}</span>
                      <span>Solicitado: <span className="text-foreground font-medium">{d.cantidad}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {paso === 2 && ocSel && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">OC seleccionada</p>
              <p className="font-mono font-semibold text-foreground text-xs">{ocSel.id}</p>
              <p className="text-xs text-muted-foreground">
                {fmt(ocSel.total)} · {new Date(ocSel.fecha_creacion).toLocaleDateString("es-CL")}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">Verificar cantidades físicas recibidas</p>
              <p className="text-xs text-muted-foreground mb-2">
                Ajusta las cantidades si lo recibido difiere de lo solicitado.
              </p>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-xs text-muted-foreground uppercase">Producto</th>
                      <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Solicitado</th>
                      <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Recibido</th>
                      <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Diff.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocSel.detalles.map(d => {
                      const rec  = cantidades[d.id_producto] ?? d.cantidad;
                      const diff = rec - d.cantidad;
                      return (
                        <tr key={d.id} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">
                            <p className="font-medium text-foreground text-xs">{d.nombre_producto}</p>
                            <p className="font-mono text-xs text-muted-foreground">{d.id_producto.slice(0, 12)}...</p>
                          </td>
                          <td className="px-3 py-2 text-center font-medium text-foreground">{d.cantidad}</td>
                          <td className="px-3 py-2 text-center">
                            <Input
                              type="number" min={0}
                              value={rec}
                              onChange={e => setCantidades(p => ({ ...p, [d.id_producto]: Number(e.target.value) }))}
                              className="w-20 mx-auto text-center h-8"
                            />
                          </td>
                          <td className="px-3 py-2 text-center text-xs font-semibold">
                            {diff === 0
                              ? <span className="text-green-500 flex justify-center"><Check className="w-4 h-4" /></span>
                              : <span className={diff < 0 ? "text-red-500" : "text-yellow-500"}>{diff > 0 ? "+" : ""}{diff}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {hayDiscrepancia && (
              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-3 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500">
                  Hay diferencias entre lo solicitado y lo recibido.
                  Compras recibirá las cantidades reales al confirmar.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Operador que Recibe *</label>
              <Select value={operador} onValueChange={setOperador}>
                <SelectTrigger className={err.op ? "border-red-500/50" : ""}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {operadores.map(o => (
                    <SelectItem key={o.id_empleado} value={o.id_empleado}>{o.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err.op && <p className="text-xs text-red-500">{err.op}</p>}
            </div>
          </div>
        )}

        {registrar.isError && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-500">Error al registrar la recepción. Intenta nuevamente.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {paso === 1 && (
            <Button disabled={!ocSel} onClick={() => setPaso(2)}>
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {paso === 2 && (
            <>
              <Button variant="outline" onClick={() => setPaso(1)}>Atrás</Button>
              <Button onClick={handleRegistrar} disabled={registrar.isPending}>
                {registrar.isPending
                  ? "Registrando..."
                  : <><PackageCheck className="w-4 h-4 mr-2" />Confirmar Recepción</>}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function LogisticaPage() {
  const { data: ots  = [],          isLoading: loadOts  } = useOTsPicking();
  const { data: guias = [],         isLoading: loadGuias } = useGuiasDespacho();
  const { data: ocs  = [],          isLoading: loadOcs  } = useOrdenesCompra();
  const { data: recepciones = []                        } = useRecepciones();
  const { data: transportistas = []                     } = useTransportistas();
  const actualizarOT = useActualizarEstadoOT();

  const [crearOTOpen,    setCrearOTOpen]    = useState(false);
  const [emitirGuia,     setEmitirGuia]     = useState<OTPicking | null>(null);
  const [recepcionOpen,  setRecepcionOpen]  = useState(false);

  const [searchOT, setSearchOT] = useState("");
  const [filtroOT, setFiltroOT] = useState("todos");
  const [searchOC, setSearchOC] = useState("");

  const otsFiltradas = ots.filter(o => {
    const match = `${o.id_ot} ${o.id_pedido_venta} ${o.nombre_empleado}`.toLowerCase().includes(searchOT.toLowerCase());
    return match && (filtroOT === "todos" || o.estado === filtroOT);
  });

  const ocsPendientes = ocs.filter(oc => oc.estado === "ENVIADA");
  const otsPend       = ots.filter(o => o.estado === "PENDIENTE").length;
  const otsProc       = ots.filter(o => o.estado === "EN_PROCESO").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logística / Despacho</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestión de OTs de picking, guías de despacho y recepciones de OC
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setRecepcionOpen(true)}>
            <ArrowDownToLine className="w-4 h-4 mr-2" />Registrar Recepción
          </Button>
          <Button onClick={() => setCrearOTOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Nueva OT de Picking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="OTs Pendientes"   value={otsPend}              sub="esperando ejecución"    color="text-yellow-500" />
        <StatCard icon={Package}       label="OTs en Proceso"   value={otsProc}              sub="picking en curso"       color="text-blue-400"   />
        <StatCard icon={ArrowDownToLine} label="OCs por Recibir" value={ocsPendientes.length} sub="desde módulo Compras"  color="text-primary"    />
        <StatCard icon={Truck}         label="Transportistas"   value={transportistas.length} sub="registrados"                                   />
      </div>

      <Tabs defaultValue="ots" className="space-y-4">
        <TabsList className="bg-secondary border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="ots" className="gap-1.5">
            <ClipboardList className="w-4 h-4" />OT Picking
            {(otsPend + otsProc) > 0 && (
              <span className="bg-yellow-500/20 text-yellow-500 text-xs px-1.5 rounded-full">
                {otsPend + otsProc}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="guias" className="gap-1.5">
            <ReceiptText className="w-4 h-4" />Guías de Despacho
          </TabsTrigger>
          <TabsTrigger value="recepciones" className="gap-1.5">
            <ArrowDownToLine className="w-4 h-4" />Recepciones
          </TabsTrigger>
          <TabsTrigger value="ordenes_compra" className="gap-1.5">
            <Package className="w-4 h-4" />Órdenes de Compra
            {ocsPendientes.length > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full">
                {ocsPendientes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="transportistas" className="gap-1.5">
            <Truck className="w-4 h-4" />Transportistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ots" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar OT, pedido u operador..."
                className="pl-9"
                value={searchOT}
                onChange={e => setSearchOT(e.target.value)}
              />
            </div>
            <Select value={filtroOT} onValueChange={setFiltroOT}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                <SelectItem value="COMPLETADA">Completada</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {USE_MOCK_VENTAS && (
            <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 flex items-center gap-2">
            </div>
          )}

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID OT", "Pedido Origen", "Operador", "Fecha Creación", "Estado", "Acciones"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadOts ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground animate-pulse">Cargando...</td></tr>
                ) : otsFiltradas.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Sin resultados.</td></tr>
                ) : otsFiltradas.map(ot => (
                  <tr key={ot.id_ot} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{ot.id_ot}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ot.id_pedido_venta}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{ot.nombre_empleado}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{ot.fecha_creacion}</td>
                    <td className="px-4 py-3">{badgeOT(ot.estado)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {ot.estado === "PENDIENTE" && (
                            <DropdownMenuItem onClick={() => actualizarOT.mutate({ id_ot: ot.id_ot, estado: "EN_PROCESO" })}>
                              <ArrowUpFromLine className="w-4 h-4 mr-2 text-blue-400" />Iniciar Picking
                            </DropdownMenuItem>
                          )}
                          {ot.estado === "EN_PROCESO" && (
                            <DropdownMenuItem onClick={() => setEmitirGuia(ot)}>
                              <ReceiptText className="w-4 h-4 mr-2 text-primary" />Completar y Emitir Guía
                            </DropdownMenuItem>
                          )}
                          {(ot.estado === "PENDIENTE" || ot.estado === "EN_PROCESO") && (
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => actualizarOT.mutate({ id_ot: ot.id_ot, estado: "CANCELADA" })}
                            >
                              <X className="w-4 h-4 mr-2" />Cancelar OT
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="guias" className="space-y-4">
          <div className="rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-400">
              Las guías de despacho son documentos de referencia. El seguimiento de estado
              se coordina directamente con el transportista asignado.
            </p>
          </div>

          {loadGuias ? (
            <p className="text-center py-10 text-muted-foreground animate-pulse text-sm">Cargando guías...</p>
          ) : guias.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
              No hay guías emitidas. Se generan al completar una OT de picking.
            </div>
          ) : (
            <div className="space-y-3">
              {guias.map(g => (
                <div key={g.id_guia} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <ReceiptText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-primary font-semibold">{g.id_guia}</span>
                        <span className="font-mono text-xs text-muted-foreground">OT: {g.id_ot}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />{g.nombre_transportista} · {g.patente_vehiculo}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{g.direccion}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />Emitida: {g.fecha_emision}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recepciones" className="space-y-4">
          {recepciones.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
              No hay recepciones registradas.
              <br />
              <span className="text-xs">
                Usa "Registrar Recepción" para procesar una OC del módulo de Compras.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {recepciones.map(rec => {
                const ocAsociada = ocs.find(oc => oc.id === rec.id_orden_compra);
                return (
                  <div key={rec.id_recepcion} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                        <ArrowDownToLine className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm text-primary font-semibold">{rec.id_recepcion}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            OC: {rec.id_orden_compra.slice(0, 8)}...
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{rec.nombre_empleado}</span>
                          <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{rec.fecha_recepcion}</span>
                        </div>
                        {ocAsociada && (
                          <div className="mt-2 space-y-0.5">
                            {ocAsociada.detalles.map(d => (
                              <div key={d.id} className="flex justify-between text-xs text-muted-foreground">
                                <span>{d.nombre_producto}</span>
                                <span>
                                  Solicitado: {d.cantidad}
                                  {d.cantidad_recibida !== null && (
                                    <> · Recibido:{" "}
                                      <span className={d.cantidad_recibida === d.cantidad
                                        ? "text-green-500 font-medium"
                                        : "text-yellow-500 font-medium"}>
                                        {d.cantidad_recibida}
                                      </span>
                                    </>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ordenes_compra" className="space-y-4">
          <p className="text-xs text-muted-foreground bg-secondary border border-border rounded-lg px-3 py-2">
            Datos en tiempo real del módulo de <strong className="text-foreground">Compras</strong>.
            Las OCs en estado <strong className="text-yellow-500">ENVIADA</strong> están disponibles para recibir.
          </p>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar OC..."
              className="pl-9"
              value={searchOC}
              onChange={e => setSearchOC(e.target.value)}
            />
          </div>

          {loadOcs ? (
            <p className="text-center py-10 text-muted-foreground animate-pulse text-sm">
              Cargando órdenes de compra...
            </p>
          ) : (
            <div className="space-y-3">
              {ocs
                .filter(oc => oc.id.includes(searchOC) || oc.id_usuario.includes(searchOC))
                .map(oc => (
                  <div key={oc.id} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-primary font-semibold">
                            {oc.id.slice(0, 18)}...
                          </span>
                          <Badge className={oc.estado === "ENVIADA"
                            ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/20"
                            : "bg-green-500/15 text-green-500 border-green-500/20"}>
                            {oc.estado}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(oc.fecha_creacion).toLocaleDateString("es-CL")} · {oc.detalles.length} producto{oc.detalles.length !== 1 ? "s" : ""} · {fmt(oc.total)}
                        </p>
                      </div>
                      {oc.estado === "ENVIADA" && (
                        <Button size="sm" onClick={() => setRecepcionOpen(true)}>
                          <PackageCheck className="w-4 h-4 mr-1" />Registrar Recepción
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 rounded-md bg-secondary border border-border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left px-3 py-1.5 text-muted-foreground">Producto</th>
                            <th className="text-center px-3 py-1.5 text-muted-foreground">Cant. OC</th>
                            <th className="text-center px-3 py-1.5 text-muted-foreground">Cant. Recibida</th>
                            <th className="text-right px-3 py-1.5 text-muted-foreground">P. Unitario</th>
                          </tr>
                        </thead>
                        <tbody>
                          {oc.detalles.map(d => (
                            <tr key={d.id} className="border-b border-border last:border-0">
                              <td className="px-3 py-1.5 font-medium text-foreground">{d.nombre_producto}</td>
                              <td className="px-3 py-1.5 text-center text-foreground">{d.cantidad}</td>
                              <td className="px-3 py-1.5 text-center">
                                {d.cantidad_recibida !== null
                                  ? <span className={d.cantidad_recibida === d.cantidad
                                      ? "text-green-500 font-semibold"
                                      : "text-yellow-500 font-semibold"}>
                                      {d.cantidad_recibida}
                                    </span>
                                  : <span className="text-muted-foreground">—</span>}
                              </td>
                              <td className="px-3 py-1.5 text-right text-muted-foreground">
                                {d.precio_unitario > 0 ? fmt(d.precio_unitario) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transportistas" className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Maestro de Transportistas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {transportistas.length} transportistas registrados
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Empresa", "Patente", "Responsable", "Guías"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transportistas.map(t => {
                  const guiasT = guias.filter(g => g.id_transportista === t.id_transportista).length;
                  return (
                    <tr key={t.id_transportista} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id_transportista}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{t.nombre_transp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-foreground">{t.patente_vehiculo}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />{t.nombre_empleado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-secondary rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${(guiasT / Math.max(guias.length, 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{guiasT}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <ModalCrearOT          open={crearOTOpen}   onClose={() => setCrearOTOpen(false)} />
      <ModalEmitirGuia       ot={emitirGuia}      open={!!emitirGuia} onClose={() => setEmitirGuia(null)} />
      <ModalRegistrarRecepcion open={recepcionOpen} onClose={() => setRecepcionOpen(false)} />
    </div>
  );
}