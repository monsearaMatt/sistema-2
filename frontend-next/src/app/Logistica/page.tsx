"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useSearchParams } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import {
  AlertCircle,
  ClipboardList,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Truck,
  Package,
  Inbox,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
  History,
  Edit,
  Trash2,
  Save,
  X,
  BarChart3,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useTransportistas,
  useCrearTransportista,
  useActualizarTransportista,
  useEliminarTransportista,
  useDirecciones,
  useCrearDireccion,
  useActualizarDireccion,
  useEliminarDireccion,
  usePickings,
  useCrearPicking,
  useAsignarPicking,
  useCompletarPicking,
  useConfirmarDespacho,
  useGuias,
  useCrearGuia,
  useEmpleados,
  useMaestroClientes,
  useMaestroProductos,
  useVentasPedidos,
  useComprasOrdenes,
  useComprasSendedOrders,
  useActualizarCompraEstado,
  useRecepciones,
  useCrearRecepcion,
  useConfirmarRecepcion,
  useMovimientosInventario,
  useKpiProductividad,
  useKpiTiempoDespacho,
} from "@/src/hooks/logistica";

function SectionTitle({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Icon className="h-5 w-5 text-primary" /> {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <div id={id} className={`rounded-xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all ${className}`}>{children}</div>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon?: ElementType }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
      {Icon && (
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}

interface TransportistaApi {
  id_transportista: number;
  nombre_transp: string;
  patente_vehiculo: string;
  id_empleado: number;
  RRHH_empleado?: { nombre?: string };
}

interface DireccionApi {
  id_direccion: number;
  direccion: string;
  id_cliente: number;
}

interface PickingApi {
  id_ot: number;
  id_pedido_venta?: number;
  estado?: string;
  id_empleado?: number;
  RRHH_empleado?: { nombre?: string };
}

interface GuiaApi {
  id_guia: number;
  id_ot?: number;
  id_transportista?: number;
  id_direccion?: number;
  log_picking?: { id_ot?: number };
  log_transportista?: { id_transportista?: number };
  direccion?: { id_direccion?: number };
}

interface VentasPedidoApi {
  id_pedido: number;
  id_cliente: number;
  fecha?: string;
  estado?: string;
  total?: string;
  isPaid?: boolean;
  notes?: string;
  shippingInfo?: { address?: string; city?: string; name?: string };
  clientes?: { nombre?: string };
  ventas_detalle?: Array<{ id_detalle: number; id_producto: number; cantidad: number; subtotal: string }>;
}

interface ComprasOrdenApi {
  id: string;
  id_proveedor: string;
  fecha_creacion?: string;
  estado?: string;
  total?: number;
  ingresada?: boolean;
  Proveedor?: { nombre?: string };
  Detalle_OC?: Array<{ id_detalle: string; id_producto: string; nombre_producto: string; cantidad: number; precio_unitario: number }>;
}

interface RecepcionApi {
  id_recepcion: number;
  id_orden_compra?: string;
  id_empleado?: number;
  fecha_recepcion?: string;
  RRHH_empleado?: { nombre?: string };
}

interface MovimientoApi {
  id_movimiento: string;
  nombre_producto?: string;
  tipo: "ENTRADA" | "SALIDA" | "RESERVA";
  cantidad: number;
  referencia?: string;
  empleado_id?: string;
  fecha: string;
  inv_producto?: { nombre?: string; codigo?: string };
}

function LogisticaPageContent() {
  const { listo } = useAuthGuard(["Jefe de Logística", "Operador de Bodega", "Admin Sistema"]);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "despacho";
  const subParam = searchParams.get("sub") || "";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (subParam && activeTab === tabParam) {
      const timer = setTimeout(() => {
        const element = document.getElementById(subParam);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [subParam, activeTab, tabParam]);

  // Queries
  const queryTransportistas = useTransportistas();
  const queryDirecciones = useDirecciones();
  const queryPickings = usePickings();
  const queryGuias = useGuias();
  const queryEmpleados = useEmpleados();
  const queryMaestroClientes = useMaestroClientes();
  const queryVentasPedidos = useVentasPedidos();
  const queryComprasOrdenes = useComprasOrdenes();
  const queryComprasSended = useComprasSendedOrders();
  const queryRecepciones = useRecepciones();
  const queryMovimientos = useMovimientosInventario();
  const queryProductos = useMaestroProductos();
  const queryProductividad = useKpiProductividad();
  const queryTiempoDespacho = useKpiTiempoDespacho();

  // Mutations
  const crearTransportista = useCrearTransportista();
  const actualizarTransportista = useActualizarTransportista();
  const eliminarTransportista = useEliminarTransportista();

  const crearDireccion = useCrearDireccion();
  const actualizarDireccion = useActualizarDireccion();
  const eliminarDireccion = useEliminarDireccion();

  const crearPicking = useCrearPicking();
  const crearGuia = useCrearGuia();
  const asignarPicking = useAsignarPicking();
  const completarPicking = useCompletarPicking();
  const crearRecepcion = useCrearRecepcion();
  const confirmarRecepcion = useConfirmarRecepcion();
  const confirmarDespacho = useConfirmarDespacho();
  const actualizarCompraEstado = useActualizarCompraEstado();

  // Local forms state
  const [transportistaForm, setTransportistaForm] = useState({ nombre_transp: "", patente_vehiculo: "", id_empleado: "" });
  const [direccionForm, setDireccionForm] = useState({ direccion: "", id_cliente: "" });
  
  // CRUD editing states
  const [editTransportista, setEditTransportista] = useState<TransportistaApi | null>(null);
  const [editDireccion, setEditDireccion] = useState<DireccionApi | null>(null);

  const [guiaFormForOt, setGuiaFormForOt] = useState<Record<number, { id_transportista: string; id_direccion: string }>>({});
  const [recepcionFormForOc, setRecepcionFormForOc] = useState<Record<string, string>>({});

  // Search state
  const [searchVentas, setSearchVentas] = useState("");
  const [searchPicking, setSearchPicking] = useState("");
  const [searchCompras, setSearchCompras] = useState("");
  const [searchRecepcion, setSearchRecepcion] = useState("");
  const [searchInventario, setSearchInventario] = useState("");
  const [searchTransportista, setSearchTransportista] = useState("");
  const [searchDireccion, setSearchDireccion] = useState("");

  const isLoading =
    queryTransportistas.isLoading ||
    queryDirecciones.isLoading ||
    queryPickings.isLoading ||
    queryGuias.isLoading ||
    queryEmpleados.isLoading ||
    queryMaestroClientes.isLoading ||
    queryVentasPedidos.isLoading ||
    queryComprasOrdenes.isLoading ||
    queryComprasSended.isLoading ||
    queryRecepciones.isLoading ||
    queryMovimientos.isLoading ||
    queryProductos.isLoading ||
    queryProductividad.isLoading ||
    queryTiempoDespacho.isLoading;

  const transportistas = (queryTransportistas.data ?? []) as TransportistaApi[];
  const direcciones = (queryDirecciones.data ?? []) as DireccionApi[];
  const pickings = (queryPickings.data ?? []) as PickingApi[];
  const guias = (queryGuias.data ?? []) as GuiaApi[];
  const empleados = (queryEmpleados.data ?? []) as { id_empleado: number; nombre: string; rut?: string }[];
  const maestroClientes = (queryMaestroClientes.data ?? []) as { id_cliente: number; nombre: string; rut?: string }[];
  const ventasPedidos = (queryVentasPedidos.data ?? []) as VentasPedidoApi[];
  const comprasOrdenes = (queryComprasOrdenes.data ?? []) as ComprasOrdenApi[];
  const comprasSended = (queryComprasSended.data ?? []) as any[];
  const recepciones = (queryRecepciones.data ?? []) as RecepcionApi[];
  const movimientos = (queryMovimientos.data ?? []) as MovimientoApi[];
  const productosList = (queryProductos.data?.inventario ?? []) as any[];
  const kpiProductividad = (queryProductividad.data ?? []) as Array<{ id_empleado: number; nombre?: string; completados: number }>;
  const kpiTiempoDespacho = queryTiempoDespacho.data as { promedio_horas: number | null } | undefined;

  // Filtered lists
  const filteredVentas = useMemo(() => {
    return ventasPedidos.filter(p =>
      String(p.id_pedido).includes(searchVentas) ||
      (p.clientes?.nombre || "").toLowerCase().includes(searchVentas.toLowerCase()) ||
      (p.estado || "").toLowerCase().includes(searchVentas.toLowerCase())
    );
  }, [ventasPedidos, searchVentas]);

  const filteredPickings = useMemo(() => {
    return pickings.filter(p =>
      String(p.id_ot).includes(searchPicking) ||
      (p.estado || "").toLowerCase().includes(searchPicking.toLowerCase()) ||
      (p.RRHH_empleado?.nombre || "").toLowerCase().includes(searchPicking.toLowerCase())
    );
  }, [pickings, searchPicking]);

  const filteredCompras = useMemo(() => {
    return comprasOrdenes.filter(o =>
      o.id.toLowerCase().includes(searchCompras.toLowerCase()) ||
      (o.Proveedor?.nombre || "").toLowerCase().includes(searchCompras.toLowerCase()) ||
      (o.estado || "").toLowerCase().includes(searchCompras.toLowerCase())
    );
  }, [comprasOrdenes, searchCompras]);

  const filteredRecepciones = useMemo(() => {
    return recepciones.filter(r =>
      String(r.id_recepcion).includes(searchRecepcion) ||
      (r.id_orden_compra || "").toLowerCase().includes(searchRecepcion.toLowerCase()) ||
      (r.RRHH_empleado?.nombre || "").toLowerCase().includes(searchRecepcion.toLowerCase())
    );
  }, [recepciones, searchRecepcion]);

  const filteredProductos = useMemo(() => {
    return productosList.filter(p =>
      p.nombre.toLowerCase().includes(searchInventario.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchInventario.toLowerCase())
    );
  }, [productosList, searchInventario]);

  const filteredTransportistas = useMemo(() => {
    return transportistas.filter(t =>
      (t.nombre_transp || "").toLowerCase().includes(searchTransportista.toLowerCase()) ||
      (t.patente_vehiculo || "").toLowerCase().includes(searchTransportista.toLowerCase())
    );
  }, [transportistas, searchTransportista]);

  const filteredDirecciones = useMemo(() => {
    return direcciones.filter(d =>
      (d.direccion || "").toLowerCase().includes(searchDireccion.toLowerCase())
    );
  }, [direcciones, searchDireccion]);

  const refreshAll = async () => {
    await Promise.all([
      queryTransportistas.refetch(),
      queryDirecciones.refetch(),
      queryPickings.refetch(),
      queryGuias.refetch(),
      queryEmpleados.refetch(),
      queryMaestroClientes.refetch(),
      queryVentasPedidos.refetch(),
      queryComprasOrdenes.refetch(),
      queryRecepciones.refetch(),
      queryMovimientos.refetch(),
      queryProductos.refetch(),
      queryProductividad.refetch(),
      queryTiempoDespacho.refetch(),
    ]);
  };

  const mutationError = (error: unknown) => {
    const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
    const message = err.response?.data?.message ?? err.message ?? "Error desconocido";
    return Array.isArray(message) ? message.join(", ") : message;
  };

  // Helper for stats counts
  const statsInfo = useMemo(() => {
    const pendingSales = ventasPedidos.filter(p => p.estado === "pendiente" || p.estado === "pagado").length;
    const activePickings = pickings.filter(p => p.estado !== "Completado").length;
    const criticalProducts = productosList.filter(p => p.stock_actual <= p.stock_minimo).length;
    const pendingPurchases = comprasOrdenes.filter(o => o.estado === "APROBADA" && !o.ingresada).length;
    return { pendingSales, activePickings, criticalProducts, pendingPurchases };
  }, [ventasPedidos, pickings, productosList, comprasOrdenes]);

  // Max picking count for productivity bar scaling
  const maxCompletados = useMemo(() => {
    if (kpiProductividad.length === 0) return 1;
    return Math.max(...kpiProductividad.map(p => p.completados), 1);
  }, [kpiProductividad]);

  if (!listo) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Cargando módulo de logística...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text">
              Módulo de Logística / Despacho
            </h1>
            <p className="text-sm text-muted-foreground">
              Integración cruzada y trazabilidad total con Ventas, Compras y stock en tiempo real.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={refreshAll} className="h-9 gap-2">
            <RefreshCw className="h-4 w-4" /> Refrescar
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary flex items-center gap-2 animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin" /> Sincronizando con base de datos unificada...
          </div>
        )}

        {/* Global stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Pedidos Pendientes" value={statsInfo.pendingSales} icon={ShoppingBag} />
          <Stat label="Pickings Activos" value={statsInfo.activePickings} icon={ClipboardList} />
          <Stat label="OCs Por Recibir" value={statsInfo.pendingPurchases} icon={Inbox} />
          <Stat label="Stock Crítico" value={statsInfo.criticalProducts} icon={Package} />
        </div>

        {/* Tabs navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-max mb-6">
            <TabsTrigger value="despacho" className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Despacho
            </TabsTrigger>
            <TabsTrigger value="recepcion" className="gap-2">
              <Inbox className="h-4 w-4" /> Recepción
            </TabsTrigger>
            <TabsTrigger value="inventario" className="gap-2">
              <Package className="h-4 w-4" /> Inventario
            </TabsTrigger>
            <TabsTrigger value="kpis" className="gap-2">
              <BarChart3 className="h-4 w-4" /> KPIs
            </TabsTrigger>
            <TabsTrigger value="maestros" className="gap-2">
              <MapPin className="h-4 w-4" /> Maestros
            </TabsTrigger>
            <TabsTrigger value="compras-api" className="gap-2 text-blue-400">
              <Network className="h-4 w-4" /> Integración API
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: DESPACHO */}
          <TabsContent value="despacho" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Sales Orders */}
              <div className="lg:col-span-6 space-y-4">
                <Card>
                  <SectionTitle icon={ShoppingBag} title="Pedidos de Ventas" subtitle="Crea pickings para despachar pedidos pagados." />
                  <div className="mt-3">
                    <Input
                      placeholder="Buscar pedido..."
                      className="bg-secondary/50 text-sm"
                      value={searchVentas}
                      onChange={(e) => setSearchVentas(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredVentas.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No se encontraron pedidos de ventas.</p>
                    ) : (
                      filteredVentas.map((p) => {
                        const hasOt = pickings.some(ot => ot.id_pedido_venta === p.id_pedido);
                        return (
                          <div key={p.id_pedido} className="rounded-lg border border-border bg-background p-4 text-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-bold text-foreground">Pedido #{p.id_pedido}</span>
                              <div className="flex gap-1.5">
                                <Badge variant={p.isPaid ? "default" : "secondary"}>
                                  {p.isPaid ? "Pagado" : "Pendiente Pago"}
                                </Badge>
                                <Badge variant="outline">{p.estado}</Badge>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <p><span className="font-semibold text-foreground">Cliente:</span> {p.clientes?.nombre || "Invitado"}</p>
                              {p.shippingInfo?.address && (
                                <p><span className="font-semibold text-foreground">Dirección:</span> {p.shippingInfo.address}, {p.shippingInfo.city}</p>
                              )}
                              {p.ventas_detalle && p.ventas_detalle.length > 0 && (
                                <div className="mt-2 p-2 rounded bg-secondary/50">
                                  <p className="font-semibold text-foreground mb-1">Items:</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {p.ventas_detalle.map(d => (
                                      <li key={d.id_detalle}>ID Prod: {d.id_producto} (Cant: {d.cantidad})</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                              <span className="text-sm font-bold text-foreground">${Number(p.total).toLocaleString()}</span>
                              {!hasOt && (p.estado === "pendiente" || p.estado === "pagado") ? (
                                <Button
                                  size="sm"
                                  disabled={crearPicking.isPending}
                                  onClick={() =>
                                    crearPicking.mutate(
                                      { id_pedido_venta: p.id_pedido, estado: "Pendiente" },
                                      { 
                                        onSuccess: () => alert(`Picking generado con éxito para el Pedido #${p.id_pedido}`),
                                        onError: (error) => alert(`Error al generar picking: ${mutationError(error)}`)
                                      }
                                    )
                                  }
                                >
                                  Generar Picking (OT)
                                </Button>
                              ) : hasOt ? (
                                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5" /> Picking Generado
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column: Pickings & OTs */}
              <div className="lg:col-span-6 space-y-6">
                <Card id="pickings">
                  <SectionTitle icon={ClipboardList} title="Pickings y Órdenes de Trabajo (OT)" subtitle="Asigna operarios, emite guías y descuenta stock." />
                  <div className="mt-3">
                    <Input
                      placeholder="Buscar picking..."
                      className="bg-secondary/50 text-sm"
                      value={searchPicking}
                      onChange={(e) => setSearchPicking(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredPickings.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No hay pickings disponibles.</p>
                    ) : (
                      filteredPickings.map((item) => {
                        const otId = item.id_ot;
                        const guia = guias.find(g => (g.id_ot ?? g.log_picking?.id_ot) === otId);
                        const hasGuia = !!guia;

                        return (
                          <div key={otId} className="rounded-lg border border-border bg-background p-4 text-sm flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-foreground">OT #{otId}</span>
                              <div className="flex items-center gap-1.5">
                                <Badge variant={item.estado === "Completado" ? "default" : item.estado === "En Proceso" ? "secondary" : "outline"}>
                                  {item.estado}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Pedido venta asociado: <span className="font-semibold text-foreground">#{item.id_pedido_venta ?? "Ninguno"}</span>
                            </p>

                            {/* State Flow Controls */}
                            <div className="grid gap-2 bg-secondary/30 p-2.5 rounded border border-border/40">
                              {/* 1. Assignment */}
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-muted-foreground font-semibold">Operario:</span>
                                <select
                                  className="h-8 rounded border border-input bg-background px-2 text-xs text-foreground outline-none w-44"
                                  value={item.id_empleado ?? ""}
                                  disabled={item.estado === "Completado" || asignarPicking.isPending}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                      asignarPicking.mutate({ id: otId, id_empleado: Number(val) }, {
                                        onError: (error) => alert(`Error al asignar operario: ${mutationError(error)}`)
                                      });
                                    }
                                  }}
                                >
                                  <option value="">Sin asignar</option>
                                  {empleados.map((emp) => (
                                    <option key={emp.id_empleado} value={emp.id_empleado}>
                                      {emp.nombre}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* 2. Emit Guide Form if no guide and operator assigned */}
                              {item.id_empleado && !hasGuia && item.estado !== "Completado" && (
                                <div className="mt-2 border-t border-border/40 pt-2 flex flex-col gap-2">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Emitir Guía de Despacho</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <select
                                      className="h-7 text-xs rounded border border-input bg-background px-2 text-foreground outline-none"
                                      value={guiaFormForOt[otId]?.id_transportista || ""}
                                      onChange={(e) => setGuiaFormForOt(prev => ({
                                        ...prev,
                                        [otId]: { ...prev[otId], id_transportista: e.target.value }
                                      }))}
                                    >
                                      <option value="">Transportista</option>
                                      {transportistas.map(t => <option key={t.id_transportista} value={t.id_transportista}>{t.nombre_transp}</option>)}
                                    </select>
                                    <select
                                      className="h-7 text-xs rounded border border-input bg-background px-2 text-foreground outline-none"
                                      value={guiaFormForOt[otId]?.id_direccion || ""}
                                      onChange={(e) => setGuiaFormForOt(prev => ({
                                        ...prev,
                                        [otId]: { ...prev[otId], id_direccion: e.target.value }
                                      }))}
                                    >
                                      <option value="">Dirección</option>
                                      {direcciones.map(d => <option key={d.id_direccion} value={d.id_direccion}>{d.direccion}</option>)}
                                    </select>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs mt-1 w-full"
                                    disabled={!guiaFormForOt[otId]?.id_transportista || !guiaFormForOt[otId]?.id_direccion || crearGuia.isPending}
                                    onClick={() => {
                                      crearGuia.mutate({
                                        id_ot: otId,
                                        id_transportista: Number(guiaFormForOt[otId]?.id_transportista),
                                        id_direccion: Number(guiaFormForOt[otId]?.id_direccion)
                                      }, {
                                        onSuccess: () => alert("Guía de despacho emitida correctamente."),
                                        onError: (error) => alert(`Error al emitir guía: ${mutationError(error)}`)
                                      });
                                    }}
                                  >
                                    Emitir Guía
                                  </Button>
                                </div>
                              )}

                              {/* 3. Has Guide Badge */}
                              {hasGuia && (
                                <div className="mt-1 pt-1 flex items-center justify-between border-t border-border/40 text-xs">
                                  <span className="text-muted-foreground font-semibold">Guía emitida:</span>
                                  <span className="font-bold text-foreground">Guía #{guia.id_guia}</span>
                                </div>
                              )}
                            </div>

                            {/* Final Action: Confirm Dispatch to Inventory */}
                            {item.estado !== "Completado" && (
                              <div className="flex gap-2 justify-end mt-1">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full h-8 text-xs font-semibold gap-1"
                                  disabled={!item.id_empleado || !hasGuia || confirmarDespacho.isPending}
                                  onClick={() => {
                                    confirmarDespacho.mutate(otId, {
                                      onSuccess: () => alert("Egreso de stock confirmado. Se registró movimiento SALIDA en inventario."),
                                      onError: (error) => alert(`Error al confirmar egreso: ${mutationError(error)}`)
                                    });
                                  }}
                                >
                                  <Package className="h-3.5 w-3.5" /> Confirmar Egreso a Inventario
                                </Button>
                              </div>
                            )}

                            {item.estado === "Completado" && (
                              <div className="mt-1 flex items-center justify-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-bold gap-1">
                                <CheckCircle className="h-4 w-4" /> Despacho Completado e Integrado con Inventario
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: RECEPCION */}
          <TabsContent value="recepcion" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Purchase Orders */}
              <div className="lg:col-span-6 space-y-4">
                <Card>
                  <SectionTitle icon={Inbox} title="Órdenes de Compra (OC)" subtitle="Registra ingresos de mercadería para compras autorizadas." />
                  <div className="mt-3">
                    <Input
                      placeholder="Buscar Orden de Compra..."
                      className="bg-secondary/50 text-sm"
                      value={searchCompras}
                      onChange={(e) => setSearchCompras(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredCompras.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No se encontraron órdenes de compra.</p>
                    ) : (
                      filteredCompras.map((oc) => {
                        const hasRecepcion = recepciones.some(r => r.id_orden_compra === oc.id);
                        return (
                          <div key={oc.id} className="rounded-lg border border-border bg-background p-4 text-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-bold text-foreground">OC #{oc.id.substring(0, 8)}...</span>
                              <div className="flex gap-1.5">
                                <Badge variant={oc.ingresada ? "default" : "secondary"}>
                                  {oc.ingresada ? "Ingresada" : "Pendiente Ingreso"}
                                </Badge>
                                <Badge variant="outline">{oc.estado}</Badge>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground mb-3">
                              <p><span className="font-semibold text-foreground">Proveedor:</span> {oc.Proveedor?.nombre || "Desconocido"}</p>
                              {oc.Detalle_OC && oc.Detalle_OC.length > 0 && (
                                <div className="mt-2 p-2 rounded bg-secondary/50">
                                  <p className="font-semibold text-foreground mb-1">Productos a Recibir:</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {oc.Detalle_OC.map(d => (
                                      <li key={d.id_detalle}>{d.nombre_producto} (Cant: {d.cantidad})</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Register Reception Inline Form */}
                            {!hasRecepcion && oc.estado === "APROBADA" && !oc.ingresada ? (
                              <div className="border-t border-border/40 pt-3 flex flex-col gap-2">
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Registrar Ingreso Físico</p>
                                <div className="flex items-center gap-2">
                                  <select
                                    className="h-8 rounded border border-input bg-background px-2 text-xs text-foreground outline-none flex-1"
                                    value={recepcionFormForOc[oc.id] || ""}
                                    onChange={(e) => setRecepcionFormForOc(prev => ({ ...prev, [oc.id]: e.target.value }))}
                                  >
                                    <option value="">Empleado Receptor</option>
                                    {empleados.map((emp) => (
                                      <option key={emp.id_empleado} value={emp.id_empleado}>
                                        {emp.nombre}
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    size="sm"
                                    className="h-8"
                                    disabled={!recepcionFormForOc[oc.id] || crearRecepcion.isPending}
                                    onClick={() => {
                                      crearRecepcion.mutate({
                                        id_orden_compra: oc.id,
                                        id_empleado: Number(recepcionFormForOc[oc.id])
                                      }, {
                                        onSuccess: () => alert("Recepción registrada físicamente en bodega. Ahora confirma el ingreso a inventario."),
                                        onError: (error) => alert(`Error al registrar recepción: ${mutationError(error)}`)
                                      });
                                    }}
                                  >
                                    Registrar
                                  </Button>
                                </div>
                              </div>
                            ) : hasRecepcion ? (
                              <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Estado Recepción:</span>
                                <span className="font-bold text-emerald-500 flex items-center gap-1">
                                  <CheckCircle className="h-3.5 w-3.5" /> Recepción Registrada
                                </span>
                              </div>
                            ) : null}

                            {oc.estado !== "ENVIADA" && !oc.ingresada && (
                              <div className="mt-2 pt-2 border-t border-border/40 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-[10px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-1"
                                  disabled={actualizarCompraEstado.isPending}
                                  onClick={() => {
                                    actualizarCompraEstado.mutate({
                                      id: oc.id,
                                      estado: "ENVIADA"
                                    }, {
                                      onSuccess: () => alert(`Orden ${oc.id.substring(0, 8)}... marcada como ENVIADA en el backend externo.`),
                                      onError: (err) => alert(`Error al actualizar estado: ${mutationError(err)}`)
                                    });
                                  }}
                                >
                                  <Network className="h-3 w-3" /> Simular Envío (API)
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column: Receptions */}
              <div className="lg:col-span-6 space-y-4">
                <Card>
                  <SectionTitle icon={ClipboardList} title="Recepciones Registradas" subtitle="Ingresa el stock físico recibido a inventario." />
                  <div className="mt-3">
                    <Input
                      placeholder="Buscar recepción..."
                      className="bg-secondary/50 text-sm"
                      value={searchRecepcion}
                      onChange={(e) => setSearchRecepcion(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredRecepciones.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No hay registros de recepción.</p>
                    ) : (
                      filteredRecepciones.map((r) => {
                        const associatedOc = comprasOrdenes.find(o => o.id === r.id_orden_compra);
                        const isConfirmed = associatedOc?.ingresada ?? false;

                        return (
                          <div key={r.id_recepcion} className="rounded-lg border border-border bg-background p-4 text-sm flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-foreground">Recepción #{r.id_recepcion}</span>
                              <Badge variant={isConfirmed ? "default" : "secondary"}>
                                {isConfirmed ? "Ingresado" : "Pendiente Confirmación"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              OC: <span className="font-semibold text-foreground">{r.id_orden_compra ? r.id_orden_compra.substring(0, 8) : "—"}...</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Recibido por: <span className="font-semibold text-foreground">{r.RRHH_empleado?.nombre || `#${r.id_empleado}`}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Fecha: <span className="font-semibold text-foreground">{r.fecha_recepcion ? new Date(r.fecha_recepcion).toLocaleString() : "—"}</span>
                            </p>

                            {!isConfirmed ? (
                              <Button
                                size="sm"
                                className="mt-2 w-full h-8 text-xs font-semibold gap-1 bg-primary hover:bg-primary/90"
                                disabled={confirmarRecepcion.isPending}
                                onClick={() => {
                                  confirmarRecepcion.mutate(r.id_recepcion, {
                                    onSuccess: () => alert("Ingreso confirmado. El stock fue cargado a Inventario y se generó el movimiento de ENTRADA."),
                                    onError: (error) => alert(`Error al confirmar ingreso: ${mutationError(error)}`)
                                  });
                                }}
                              >
                                <Package className="h-3.5 w-3.5" /> Confirmar Ingreso a Inventario
                              </Button>
                            ) : (
                              <div className="mt-2 flex items-center justify-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-bold gap-1">
                                <CheckCircle className="h-4 w-4" /> Mercadería Ingresada e Integrada al Stock
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: INVENTARIO */}
          <TabsContent value="inventario" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Product Stock Table */}
              <div className="lg:col-span-7 space-y-4">
                <Card>
                  <SectionTitle icon={Package} title="Catálogo de Stock en Tiempo Real" subtitle="Consulta el stock actual y alertas de inventario." />
                  <div className="mt-3">
                    <Input
                      placeholder="Buscar producto por nombre o código..."
                      className="bg-secondary/50 text-sm"
                      value={searchInventario}
                      onChange={(e) => setSearchInventario(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground uppercase font-semibold">
                          <th className="py-2.5 px-3">Producto</th>
                          <th className="py-2.5 px-3">Código</th>
                          <th className="py-2.5 px-3 text-right">Precio</th>
                          <th className="py-2.5 px-3 text-center">Stock Mín.</th>
                          <th className="py-2.5 px-3 text-center">Stock Actual</th>
                          <th className="py-2.5 px-3 text-center">Alerta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProductos.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">No hay productos en inventario.</td>
                          </tr>
                        ) : (
                          filteredProductos.map((p) => {
                            const isCritical = p.stock_actual <= p.stock_minimo;
                            return (
                              <tr key={p.id_producto} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                                <td className="py-3 px-3 font-semibold text-foreground">{p.nombre}</td>
                                <td className="py-3 px-3"><Badge variant="outline">{p.codigo}</Badge></td>
                                <td className="py-3 px-3 text-right">${Number(p.precio).toLocaleString()}</td>
                                <td className="py-3 px-3 text-center">{p.stock_minimo}</td>
                                <td className="py-3 px-3 text-center font-bold">{p.stock_actual}</td>
                                <td className="py-3 px-3 text-center">
                                  {isCritical ? (
                                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5">Crítico</Badge>
                                  ) : (
                                    <Badge className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20">Ok</Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Movements List */}
              <div className="lg:col-span-5 space-y-4">
                <Card>
                  <SectionTitle icon={History} title="Movimientos de Inventario" subtitle="Entradas y salidas generadas por despachos y recepciones." />
                  <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {movimientos.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No se han registrado movimientos.</p>
                    ) : (
                      movimientos.map((m) => {
                        const isEntrada = m.tipo === "ENTRADA";
                        return (
                          <div key={m.id_movimiento} className="rounded-lg border border-border bg-background p-3 text-sm flex flex-col gap-1 hover:border-primary/20 transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-foreground">{m.inv_producto?.nombre ?? "Producto"}</span>
                              <Badge variant={isEntrada ? "default" : "destructive"} className="text-[10px] py-0.5">
                                {m.tipo}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                              <span>Cantidad: <strong className="text-foreground">{m.cantidad}</strong></span>
                              <span>Ref: <strong className="text-foreground">{m.referencia || "—"}</strong></span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 mt-1 border-t border-border/20 pt-1">
                              <span>Encargado: {m.empleado_id || "System"}</span>
                              <span>{new Date(m.fecha).toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: KPIS */}
          <TabsContent value="kpis" className="space-y-6 outline-none">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="flex flex-col justify-between">
                <div>
                  <SectionTitle icon={TrendingUp} title="Tiempo Promedio de Despacho" subtitle="KPI transaccional calculado desde que se inicia la OT de picking hasta que se emite la guía." />
                  <p className="text-xs text-muted-foreground mt-2">
                    Mide el rendimiento operacional del equipo de logística en horas.
                  </p>
                </div>
                <div className="my-8 text-center">
                  <span className="text-6xl font-extrabold text-primary tracking-tight">
                    {kpiTiempoDespacho?.promedio_horas !== undefined && kpiTiempoDespacho?.promedio_horas !== null
                      ? `${Number(kpiTiempoDespacho.promedio_horas).toFixed(1)} hrs`
                      : "Sin datos"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">Promedio general histórico</p>
                </div>
                <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-400">
                  <strong>Nota del sistema:</strong> Este KPI se calcula de forma dinámica en la base de datos comparando las marcas temporales de creación del Picking y emisión de la Guía de despacho.
                </div>
              </Card>

              <Card>
                <SectionTitle icon={ClipboardList} title="Productividad por Empleado" subtitle="Cantidad de Picking OTs completados exitosamente." />
                <p className="text-xs text-muted-foreground mt-1 mb-6">
                  Ayuda a evaluar el desempeño individual de los operarios de bodega.
                </p>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {kpiProductividad.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">No hay datos de productividad disponibles.</p>
                  ) : (
                    kpiProductividad.map((emp) => {
                      const percentage = (emp.completados / maxCompletados) * 100;
                      return (
                        <div key={emp.id_empleado} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-foreground">{emp.nombre || `Empleado #${emp.id_empleado}`}</span>
                            <Badge variant="outline">{emp.completados} completados</Badge>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 5: MAESTROS */}
          <TabsContent value="maestros" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Transportistas CRUD */}
              <Card id="transportistas">
                <SectionTitle icon={Truck} title="Gestión de Transportistas" subtitle="CRUD de transportistas autorizados para guías." />
                
                {/* Form Context: Create or Update */}
                <div className="mt-4 p-4 rounded-lg bg-secondary/35 border border-border/50 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {editTransportista ? "Editar Transportista" : "Registrar Nuevo Transportista"}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input 
                      placeholder="Nombre" 
                      value={editTransportista ? editTransportista.nombre_transp : transportistaForm.nombre_transp} 
                      onChange={(e) => {
                        if (editTransportista) {
                          setEditTransportista(prev => prev ? { ...prev, nombre_transp: e.target.value } : null);
                        } else {
                          setTransportistaForm(prev => ({ ...prev, nombre_transp: e.target.value }));
                        }
                      }} 
                    />
                    <Input 
                      placeholder="Patente (ABCD12)" 
                      value={editTransportista ? editTransportista.patente_vehiculo : transportistaForm.patente_vehiculo} 
                      onChange={(e) => {
                        if (editTransportista) {
                          setEditTransportista(prev => prev ? { ...prev, patente_vehiculo: e.target.value } : null);
                        } else {
                          setTransportistaForm(prev => ({ ...prev, patente_vehiculo: e.target.value }));
                        }
                      }} 
                    />
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground outline-none"
                      value={editTransportista ? String(editTransportista.id_empleado) : transportistaForm.id_empleado}
                      onChange={(e) => {
                        if (editTransportista) {
                          setEditTransportista(prev => prev ? { ...prev, id_empleado: Number(e.target.value) } : null);
                        } else {
                          setTransportistaForm(prev => ({ ...prev, id_empleado: e.target.value }));
                        }
                      }}
                    >
                      <option value="">Empleado RRHH</option>
                      {empleados.map((emp) => (
                        <option key={emp.id_empleado} value={emp.id_empleado}>
                          {emp.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {editTransportista ? (
                      <>
                        <Button
                          size="sm"
                          disabled={actualizarTransportista.isPending || !editTransportista.nombre_transp || !editTransportista.patente_vehiculo || !editTransportista.id_empleado}
                          onClick={() => {
                            actualizarTransportista.mutate({
                              id: editTransportista.id_transportista,
                              payload: {
                                nombre_transp: editTransportista.nombre_transp,
                                patente_vehiculo: editTransportista.patente_vehiculo.toUpperCase(),
                                id_empleado: Number(editTransportista.id_empleado)
                              }
                            }, {
                              onSuccess: () => {
                                setEditTransportista(null);
                                alert("Transportista actualizado.");
                              }
                            });
                          }}
                        >
                          <Save className="h-4 w-4 mr-1.5" /> Guardar Cambios
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditTransportista(null)}>
                          <X className="h-4 w-4 mr-1.5" /> Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        disabled={crearTransportista.isPending || !transportistaForm.nombre_transp || !transportistaForm.patente_vehiculo || !transportistaForm.id_empleado}
                        onClick={() =>
                          crearTransportista.mutate(
                            { nombre_transp: transportistaForm.nombre_transp, patente_vehiculo: transportistaForm.patente_vehiculo.toUpperCase(), id_empleado: Number(transportistaForm.id_empleado) },
                            { onSuccess: () => {
                              setTransportistaForm({ nombre_transp: "", patente_vehiculo: "", id_empleado: "" });
                              alert("Transportista creado.");
                            }}
                          )
                        }
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> Crear Transportista
                      </Button>
                    )}
                  </div>
                  {(crearTransportista.isError || actualizarTransportista.isError) && (
                    <p className="text-xs text-red-500">Error: {mutationError(crearTransportista.error ?? actualizarTransportista.error)}</p>
                  )}
                </div>

                <div className="mt-4">
                  <Input
                    placeholder="Buscar transportista..."
                    className="h-8 text-xs bg-secondary/50"
                    value={searchTransportista}
                    onChange={(e) => setSearchTransportista(e.target.value)}
                  />
                </div>

                {/* Transportistas List with CRUD actions */}
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredTransportistas.map((item) => (
                    <div key={item.id_transportista} className="rounded-lg border border-border bg-secondary p-3 text-sm flex items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground">{item.nombre_transp}</span>
                          <Badge variant="outline">{item.patente_vehiculo}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Empleado: {item.RRHH_empleado?.nombre || item.id_empleado}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => setEditTransportista(item)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          disabled={eliminarTransportista.isPending}
                          onClick={() => {
                            if (confirm(`¿Eliminar al transportista ${item.nombre_transp}?`)) {
                              eliminarTransportista.mutate(item.id_transportista, {
                                onSuccess: () => alert("Transportista eliminado correctamente.")
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Direcciones CRUD */}
              <Card id="direcciones">
                <SectionTitle icon={MapPin} title="Direcciones de Despacho" subtitle="CRUD de direcciones de entrega de clientes." />
                
                {/* Form Context: Create or Update */}
                <div className="mt-4 p-4 rounded-lg bg-secondary/35 border border-border/50 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {editDireccion ? "Editar Dirección" : "Registrar Nueva Dirección"}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input 
                      placeholder="Dirección física" 
                      value={editDireccion ? editDireccion.direccion : direccionForm.direccion} 
                      onChange={(e) => {
                        if (editDireccion) {
                          setEditDireccion(prev => prev ? { ...prev, direccion: e.target.value } : null);
                        } else {
                          setDireccionForm(prev => ({ ...prev, direccion: e.target.value }));
                        }
                      }} 
                    />
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground outline-none"
                      value={editDireccion ? String(editDireccion.id_cliente) : direccionForm.id_cliente}
                      onChange={(e) => {
                        if (editDireccion) {
                          setEditDireccion(prev => prev ? { ...prev, id_cliente: Number(e.target.value) } : null);
                        } else {
                          setDireccionForm(prev => ({ ...prev, id_cliente: e.target.value }));
                        }
                      }}
                    >
                      <option value="">Cliente</option>
                      {maestroClientes.map((cli) => (
                        <option key={cli.id_cliente} value={cli.id_cliente}>
                          {cli.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {editDireccion ? (
                      <>
                        <Button
                          size="sm"
                          disabled={actualizarDireccion.isPending || !editDireccion.direccion || !editDireccion.id_cliente}
                          onClick={() => {
                            actualizarDireccion.mutate({
                              id: editDireccion.id_direccion,
                              payload: {
                                direccion: editDireccion.direccion,
                                id_cliente: Number(editDireccion.id_cliente)
                              }
                            }, {
                              onSuccess: () => {
                                setEditDireccion(null);
                                alert("Dirección actualizada.");
                              }
                            });
                          }}
                        >
                          <Save className="h-4 w-4 mr-1.5" /> Guardar Cambios
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditDireccion(null)}>
                          <X className="h-4 w-4 mr-1.5" /> Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        disabled={crearDireccion.isPending || !direccionForm.direccion || !direccionForm.id_cliente}
                        onClick={() =>
                          crearDireccion.mutate(
                            { direccion: direccionForm.direccion, id_cliente: Number(direccionForm.id_cliente) },
                            { onSuccess: () => {
                              setDireccionForm({ direccion: "", id_cliente: "" });
                              alert("Dirección creada.");
                            }}
                          )
                        }
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> Crear Dirección
                      </Button>
                    )}
                  </div>
                  {(crearDireccion.isError || actualizarDireccion.isError) && (
                    <p className="text-xs text-red-500">Error: {mutationError(crearDireccion.error ?? actualizarDireccion.error)}</p>
                  )}
                </div>

                <div className="mt-4">
                  <Input
                    placeholder="Buscar dirección..."
                    className="h-8 text-xs bg-secondary/50"
                    value={searchDireccion}
                    onChange={(e) => setSearchDireccion(e.target.value)}
                  />
                </div>

                {/* Direcciones List with CRUD actions */}
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredDirecciones.map((item) => (
                    <div key={item.id_direccion} className="rounded-lg border border-border bg-secondary p-3 text-sm flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{item.direccion}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Cliente: {maestroClientes.find(c => c.id_cliente === item.id_cliente)?.nombre || item.id_cliente}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => setEditDireccion(item)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          disabled={eliminarDireccion.isPending}
                          onClick={() => {
                            if (confirm(`¿Eliminar la dirección "${item.direccion}"?`)) {
                              eliminarDireccion.mutate(item.id_direccion, {
                                onSuccess: () => alert("Dirección eliminada correctamente.")
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 6: INTEGRACIÓN API COMPRAS */}
          <TabsContent value="compras-api" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: API Status & Explanation */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="border border-border/50 bg-card/40 backdrop-blur-md p-6">
                  <SectionTitle 
                    icon={Network} 
                    title="Estado de la Integración" 
                    subtitle="Monitorización de endpoints HTTP REST con el módulo de Compras." 
                  />
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/35 border border-border/40">
                      <span className="text-sm font-medium">Servidor de Compras</span>
                      {queryComprasSended.isError ? (
                        <Badge variant="destructive" className="gap-1 animate-pulse">
                          <AlertCircle className="h-3 w-3" /> Desconectado
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 gap-1">
                          <CheckCircle className="h-3 w-3" /> Conectado (Port 4000)
                        </Badge>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flujo de Integración</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Este módulo consume datos transaccionales de compras a través de peticiones HTTP en tiempo real. 
                        No lee de la base de datos local de Logística, sirviendo como evidencia de conexión cruzada entre servicios.
                      </p>
                      <div className="text-[10px] font-mono bg-black/30 p-2 rounded text-blue-300 overflow-x-auto space-y-1">
                        <div>GET /logistica/compras/sended</div>
                        <div className="text-muted-foreground">↳ Proxy hacia:</div>
                        <div className="text-emerald-400 font-bold">GET http://localhost:4000/api/buy-order/sended</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 space-y-2">
                      <h4 className="text-xs font-semibold text-blue-400">¿Cómo verificar la conexión?</h4>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                        <li><strong>Evidencia 1 (Desconectado):</strong> Apaga el backend de Compras y actualiza la pestaña. Verás el indicador en rojo y un fallo de red.</li>
                        <li><strong>Evidencia 2 (Conectado):</strong> Levanta el backend de Compras en el puerto 4000 y refresca. Se pondrá en verde y listará las órdenes.</li>
                        <li><strong>Evidencia 3 (Trazabilidad):</strong> Usa el botón "Simular Envío" en la pestaña de Recepción para cambiar el estado a <code className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-1 rounded">ENVIADA</code>.</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-xs"
                        disabled={queryComprasSended.isRefetching}
                        onClick={() => {
                          queryComprasSended.refetch();
                        }}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${queryComprasSended.isRefetching ? "animate-spin" : ""}`} />
                        Refrescar Conexión
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Sended Orders List */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <SectionTitle 
                      icon={FileText} 
                      title="Órdenes de Compra en Tránsito (API)" 
                      subtitle="Órdenes con estado ENVIADA recuperadas dinámicamente desde el backend de Compras." 
                    />
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {comprasSended.length} orden(es)
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-4">
                    {queryComprasSended.isError ? (
                      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
                        <AlertCircle className="h-10 w-10 text-destructive mb-3 animate-pulse" />
                        <h3 className="font-semibold text-destructive">Error al conectar con la API de Compras</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          No se pudo establecer conexión con el backend de compras en <code className="text-[10px] bg-black/40 px-1 py-0.5 rounded font-mono text-red-300">http://localhost:4000</code>.
                          Asegúrate de que ese servidor esté encendido.
                        </p>
                      </div>
                    ) : comprasSended.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-secondary/5">
                        <Inbox className="h-10 w-10 text-muted-foreground/50 mb-3" />
                        <h3 className="font-medium">No hay órdenes en estado ENVIADA</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          La conexión con el backend externo es exitosa, pero actualmente no existen órdenes de compra con estado <code className="text-xs font-mono text-emerald-400">ENVIADA</code> en su base de datos.
                        </p>
                        <div className="mt-4 p-4 bg-secondary/20 rounded-lg text-left border border-border/30 max-w-md">
                          <p className="text-xs text-muted-foreground font-semibold text-center sm:text-left">Simular Envío de Orden:</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Puedes forzar una orden al estado <code className="text-xs font-mono">ENVIADA</code> haciendo clic en el botón "Simular Envío" de cualquiera de las órdenes pendientes en la pestaña de <strong>Recepción</strong>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comprasSended.map((oc) => (
                          <div 
                            key={oc.id} 
                            className="p-5 rounded-xl border border-border/50 bg-secondary/15 hover:bg-secondary/25 transition-all duration-200 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID de Orden (UUID)</span>
                                <h3 className="text-sm font-mono font-bold text-primary">{oc.id}</h3>
                              </div>
                              <div className="flex gap-2">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                  {oc.estado}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Total: ${Number(oc.total).toLocaleString()}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs p-3 rounded-lg bg-secondary/25 border border-border/20">
                              <div>
                                <span className="text-muted-foreground block font-medium">Proveedor</span>
                                <span className="font-semibold">{oc.proveedor || "No especificado"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block font-medium">Fecha Emisión (Compras)</span>
                                <span className="font-semibold">{new Date(oc.fecha_creacion).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Productos de la Orden</h4>
                              <div className="divide-y divide-border/20 border border-border/20 rounded-lg overflow-hidden bg-background/50">
                                {oc.detalles?.map((det: any, idx: number) => (
                                  <div key={det.id_producto || idx} className="flex justify-between items-center p-2.5 text-xs">
                                    <div className="space-y-0.5">
                                      <span className="font-semibold">{det.nombre_producto}</span>
                                      <span className="block text-[10px] text-muted-foreground font-mono">{det.id_producto}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-semibold block">{det.cantidad} unidad(es)</span>
                                      <span className="text-[10px] text-muted-foreground">${Number(det.precio_unitario).toLocaleString()} c/u</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function LogisticaPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Cargando módulo de logística...
      </div>
    }>
      <LogisticaPageContent />
    </Suspense>
  );
}