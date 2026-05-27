"use client";

import { useState, useEffect } from "react";
import {
  Truck, Package, ClipboardList, ArrowDownToLine, ArrowUpFromLine,
  Search, Plus, Check, X, Eye, MoreHorizontal, AlertCircle,
  CheckCircle2, Filter, CalendarDays, User, MapPin, ShieldAlert,
  BadgeCheck, PhoneCall, Car, ReceiptText, Boxes, ChevronRight,
  ArrowLeftRight, PackageCheck, PackageX, Hash, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type EstadoOT       = "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
type EstadoGuia     = "EMITIDA" | "EN_TRANSITO" | "ENTREGADA";
type EstadoRec      = "CONFORME" | "CON_DISCREPANCIA";
type EstadoOC       = "PENDIENTE_RECEPCION" | "RECIBIDA_CONFORME" | "RECIBIDA_CON_DIFF";
type EstadoOV       = "PENDIENTE_DESPACHO" | "DESPACHADA" | "ENTREGADA_CONFORME" | "ENTREGADA_CON_DIFF";

interface Producto {
  codigo: string;
  nombre: string;
  unidad: string;
  stock: number;
}

interface LineaOC {
  codigo: string;
  nombre: string;
  cantidad_solicitada: number;
  cantidad_recibida?: number;
}

interface LineaOV {
  codigo: string;
  nombre: string;
  cantidad_solicitada: number;
  cantidad_despachada?: number;
  cantidad_confirmada_cliente?: number;
}

interface OrdenCompra {
  id_oc: string;
  proveedor: string;
  fecha_emision: string;
  estado: EstadoOC;
  lineas: LineaOC[];
  observaciones?: string;
}

interface OrdenVenta {
  id_ov: string;
  cliente: string;
  direccion_entrega: string;
  fecha_emision: string;
  estado: EstadoOV;
  monto_total: number;
  lineas: LineaOV[];
}

interface OTPicking {
  id_ot: string;
  id_ov: string;
  cliente: string;
  fecha_creacion: string;
  fecha_planificada: string;
  nombre_operador: string;
  id_operador: string;
  estado: EstadoOT;
  lineas: LineaOV[];
}

interface GuiaDespacho {
  id_guia: string;
  id_ot: string;
  id_ov: string;
  cliente: string;
  nombre_transportista: string;
  patente: string;
  direccion_entrega: string;
  fecha_emision: string;
  estado: EstadoGuia;
  lineas: LineaOV[];
}

interface RecepcionMercaderia {
  id_recepcion: string;
  id_oc: string;
  proveedor: string;
  fecha_recepcion: string;
  nombre_operador: string;
  estado: EstadoRec;
  observaciones: string;
  lineas: LineaOC[];
}

interface Transportista {
  id: string;
  nombre: string;
  patente: string;
  telefono: string;
  conductor: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK: Catálogo de Productos (fingimos la BD)
// ─────────────────────────────────────────────────────────────────────────────

const mockCatalogo: Producto[] = [
  { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",         unidad: "un",       stock: 18 },
  { codigo: "PRD-002", nombre: "Set brocas acero inox 10 piezas",     unidad: "set",      stock: 43 },
  { codigo: "PRD-003", nombre: "Cinta métrica 10m Stanley",           unidad: "un",       stock: 31 },
  { codigo: "PRD-004", nombre: "Cable eléctrico 2.5mm rollo 100m",    unidad: "rollo",    stock: 12 },
  { codigo: "PRD-005", nombre: "Interruptor termomagnético 25A",      unidad: "un",       stock: 25 },
  { codigo: "PRD-006", nombre: "Cinta aislante negra pack x10",       unidad: "pack",     stock: 80 },
  { codigo: "PRD-007", nombre: "Martillo carpintero 20oz",            unidad: "un",       stock: 55 },
  { codigo: "PRD-008", nombre: "Llave combinada 13mm",                unidad: "un",       stock: 70 },
  { codigo: "PRD-009", nombre: "Pintura látex blanco 20L",            unidad: "balde",    stock: 9  },
  { codigo: "PRD-010", nombre: "Disco corte metal 4.5\"",             unidad: "un",       stock: 120 },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK: Órdenes de Compra (vienen del módulo Compras)
// ─────────────────────────────────────────────────────────────────────────────

const mockOCs: OrdenCompra[] = [
  {
    id_oc: "OC-2026-00214", proveedor: "Distribuidora ElectroPro Ltda.",
    fecha_emision: "2026-05-18", estado: "RECIBIDA_CON_DIFF",
    observaciones: "PRD-005: se recibieron 17 de 20 solicitados.",
    lineas: [
      { codigo: "PRD-004", nombre: "Cable eléctrico 2.5mm rollo 100m",  cantidad_solicitada: 10, cantidad_recibida: 10 },
      { codigo: "PRD-005", nombre: "Interruptor termomagnético 25A",     cantidad_solicitada: 20, cantidad_recibida: 17 },
      { codigo: "PRD-002", nombre: "Set brocas acero inox 10 piezas",    cantidad_solicitada: 15, cantidad_recibida: 15 },
      { codigo: "PRD-006", nombre: "Cinta aislante negra pack x10",      cantidad_solicitada: 30, cantidad_recibida: 30 },
    ],
  },
  {
    id_oc: "OC-2026-00198", proveedor: "Herramientas Pro S.A.",
    fecha_emision: "2026-05-15", estado: "RECIBIDA_CONFORME",
    lineas: [
      { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",  cantidad_solicitada: 8,  cantidad_recibida: 8  },
      { codigo: "PRD-003", nombre: "Cinta métrica 10m Stanley",    cantidad_solicitada: 20, cantidad_recibida: 20 },
    ],
  },
  {
    id_oc: "OC-2026-00231", proveedor: "Distribuidora ElectroPro Ltda.",
    fecha_emision: "2026-05-24", estado: "PENDIENTE_RECEPCION",
    lineas: [
      { codigo: "PRD-004", nombre: "Cable eléctrico 2.5mm rollo 100m", cantidad_solicitada: 5  },
      { codigo: "PRD-003", nombre: "Cinta métrica 10m Stanley",         cantidad_solicitada: 10 },
      { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",       cantidad_solicitada: 3  },
    ],
  },
  {
    id_oc: "OC-2026-00228", proveedor: "Herramientas Pro S.A.",
    fecha_emision: "2026-05-23", estado: "PENDIENTE_RECEPCION",
    lineas: [
      { codigo: "PRD-002", nombre: "Set brocas acero inox 10 piezas",  cantidad_solicitada: 25 },
      { codigo: "PRD-006", nombre: "Cinta aislante negra pack x10",    cantidad_solicitada: 40 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK: Órdenes de Venta (vienen del módulo Ventas)
// ─────────────────────────────────────────────────────────────────────────────

const mockOVs: OrdenVenta[] = [
  {
    id_ov: "OV-2026-00847", cliente: "Constructora Pérez & Hijos",
    direccion_entrega: "Av. Principal 1234, Santiago",
    fecha_emision: "2026-05-20", estado: "ENTREGADA_CONFORME", monto_total: 847500,
    lineas: [
      { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",     cantidad_solicitada: 2, cantidad_despachada: 2, cantidad_confirmada_cliente: 2 },
      { codigo: "PRD-002", nombre: "Set brocas acero inox 10 piezas", cantidad_solicitada: 5, cantidad_despachada: 5, cantidad_confirmada_cliente: 5 },
      { codigo: "PRD-003", nombre: "Cinta métrica 10m Stanley",       cantidad_solicitada: 3, cantidad_despachada: 3, cantidad_confirmada_cliente: 3 },
    ],
  },
  {
    id_ov: "OV-2026-00831", cliente: "Ferretería El Martillo Ltda.",
    direccion_entrega: "Calle Los Pinos 567, Providencia",
    fecha_emision: "2026-05-19", estado: "DESPACHADA", monto_total: 312000,
    lineas: [
      { codigo: "PRD-005", nombre: "Interruptor termomagnético 25A", cantidad_solicitada: 10, cantidad_despachada: 10 },
      { codigo: "PRD-006", nombre: "Cinta aislante negra pack x10",  cantidad_solicitada: 20, cantidad_despachada: 20 },
    ],
  },
  {
    id_ov: "OV-2026-00862", cliente: "Ferretería El Martillo Ltda.",
    direccion_entrega: "Calle Los Pinos 567, Providencia",
    fecha_emision: "2026-05-26", estado: "PENDIENTE_DESPACHO", monto_total: 425000,
    lineas: [
      { codigo: "PRD-004", nombre: "Cable eléctrico 2.5mm rollo 100m", cantidad_solicitada: 3 },
      { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",       cantidad_solicitada: 2 },
    ],
  },
  {
    id_ov: "OV-2026-00858", cliente: "Inmobiliaria Sur S.A.",
    direccion_entrega: "Los Almendros 890, Las Condes",
    fecha_emision: "2026-05-25", estado: "PENDIENTE_DESPACHO", monto_total: 680000,
    lineas: [
      { codigo: "PRD-002", nombre: "Set brocas acero inox 10 piezas", cantidad_solicitada: 10 },
      { codigo: "PRD-006", nombre: "Cinta aislante negra pack x10",   cantidad_solicitada: 15 },
      { codigo: "PRD-003", nombre: "Cinta métrica 10m Stanley",        cantidad_solicitada: 5  },
    ],
  },
  {
    id_ov: "OV-2026-00871", cliente: "Constructora Norteandes",
    direccion_entrega: "Av. Las Torres 321, Quilicura",
    fecha_emision: "2026-05-26", estado: "ENTREGADA_CON_DIFF", monto_total: 195000,
    lineas: [
      { codigo: "PRD-001", nombre: "Taladro percutor 750W Bosch",    cantidad_solicitada: 1, cantidad_despachada: 1, cantidad_confirmada_cliente: 0 },
      { codigo: "PRD-005", nombre: "Interruptor termomagnético 25A", cantidad_solicitada: 5, cantidad_despachada: 5, cantidad_confirmada_cliente: 4 },
    ],
  },
];

const mockOTs: OTPicking[] = [
  {
    id_ot: "OT-2026-001", id_ov: "OV-2026-00847", cliente: "Constructora Pérez & Hijos",
    fecha_creacion: "2026-05-20", fecha_planificada: "2026-05-22",
    id_operador: "EMP-001", nombre_operador: "Carlos Riquelme", estado: "COMPLETADA",
    lineas: mockOVs[0].lineas,
  },
  {
    id_ot: "OT-2026-002", id_ov: "OV-2026-00831", cliente: "Ferretería El Martillo Ltda.",
    fecha_creacion: "2026-05-19", fecha_planificada: "2026-05-21",
    id_operador: "EMP-001", nombre_operador: "Carlos Riquelme", estado: "COMPLETADA",
    lineas: mockOVs[1].lineas,
  },
];

const mockGuias: GuiaDespacho[] = [
  {
    id_guia: "GD-2026-001", id_ot: "OT-2026-001", id_ov: "OV-2026-00847",
    cliente: "Constructora Pérez & Hijos", nombre_transportista: "TransRapid Ltda.",
    patente: "BBTK-12", direccion_entrega: "Av. Principal 1234, Santiago",
    fecha_emision: "2026-05-22", estado: "ENTREGADA", lineas: mockOVs[0].lineas,
  },
  {
    id_guia: "GD-2026-002", id_ot: "OT-2026-002", id_ov: "OV-2026-00831",
    cliente: "Ferretería El Martillo Ltda.", nombre_transportista: "LogiExpress S.A.",
    patente: "CCPL-34", direccion_entrega: "Calle Los Pinos 567, Providencia",
    fecha_emision: "2026-05-21", estado: "EN_TRANSITO", lineas: mockOVs[1].lineas,
  },
];

const mockRecepciones: RecepcionMercaderia[] = [
  {
    id_recepcion: "REC-2026-001", id_oc: "OC-2026-00214",
    proveedor: "Distribuidora ElectroPro Ltda.", fecha_recepcion: "2026-05-22",
    nombre_operador: "Carlos Riquelme", estado: "CON_DISCREPANCIA",
    observaciones: "PRD-005: Se recibieron 17 unidades. Proveedor indica despacho parcial.",
    lineas: mockOCs[0].lineas as LineaOC[],
  },
  {
    id_recepcion: "REC-2026-002", id_oc: "OC-2026-00198",
    proveedor: "Herramientas Pro S.A.", fecha_recepcion: "2026-05-18",
    nombre_operador: "Carlos Riquelme", estado: "CONFORME", observaciones: "",
    lineas: mockOCs[1].lineas as LineaOC[],
  },
];

const mockTransportistas: Transportista[] = [
  { id: "TRN-001", nombre: "TransRapid Ltda.",  patente: "BBTK-12", telefono: "+56 2 2345 6789", conductor: "Pedro Araya" },
  { id: "TRN-002", nombre: "LogiExpress S.A.",  patente: "CCPL-34", telefono: "+56 2 3456 7890", conductor: "Rodrigo Vega" },
  { id: "TRN-003", nombre: "FleteSeguro SpA",   patente: "DDMN-56", telefono: "+56 2 4567 8901", conductor: "Manuel Cisterna" },
];

const operadoresMock = [
  { id: "EMP-001", nombre: "Carlos Riquelme (EMP-001)" },
  { id: "EMP-006", nombre: "Valentina Rojas (EMP-006)" },
];

const fmt = (n: number) => `$${n.toLocaleString("es-CL")}`;

// ─────────────────────────────────────────────────────────────────────────────
// BADGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const badgeOT = (e: EstadoOT) => {
  const m: Record<EstadoOT, [string, string]> = {
    PENDIENTE:  ["bg-yellow-500/15 text-yellow-500 border-yellow-500/20", "Pendiente"],
    EN_PROCESO: ["bg-blue-500/15 text-blue-400 border-blue-500/20",       "En Proceso"],
    COMPLETADA: ["bg-green-500/15 text-green-500 border-green-500/20",    "Completada"],
    CANCELADA:  ["bg-red-500/15 text-red-500 border-red-500/20",          "Cancelada"],
  };
  return <Badge className={m[e][0]}>{m[e][1]}</Badge>;
};

const badgeGuia = (e: EstadoGuia) => {
  const m: Record<EstadoGuia, [string, string]> = {
    EMITIDA:    ["bg-yellow-500/15 text-yellow-500 border-yellow-500/20", "Emitida"],
    EN_TRANSITO:["bg-blue-500/15 text-blue-400 border-blue-500/20",       "En Tránsito"],
    ENTREGADA:  ["bg-green-500/15 text-green-500 border-green-500/20",    "Entregada"],
  };
  return <Badge className={m[e][0]}>{m[e][1]}</Badge>;
};

const badgeOV = (e: EstadoOV) => {
  const m: Record<EstadoOV, [string, string]> = {
    PENDIENTE_DESPACHO:     ["bg-yellow-500/15 text-yellow-500 border-yellow-500/20", "Pendiente Despacho"],
    DESPACHADA:             ["bg-blue-500/15 text-blue-400 border-blue-500/20",       "Despachada"],
    ENTREGADA_CONFORME:     ["bg-green-500/15 text-green-500 border-green-500/20",    "Entregada Conforme"],
    ENTREGADA_CON_DIFF:     ["bg-red-500/15 text-red-500 border-red-500/20",          "Entregada c/ Diferencia"],
  };
  return <Badge className={m[e][0]}>{m[e][1]}</Badge>;
};

const badgeOC = (e: EstadoOC) => {
  const m: Record<EstadoOC, [string, string]> = {
    PENDIENTE_RECEPCION:  ["bg-yellow-500/15 text-yellow-500 border-yellow-500/20", "Pendiente Recepción"],
    RECIBIDA_CONFORME:    ["bg-green-500/15 text-green-500 border-green-500/20",    "Recibida Conforme"],
    RECIBIDA_CON_DIFF:    ["bg-red-500/15 text-red-500 border-red-500/20",          "Recibida c/ Diferencia"],
  };
  return <Badge className={m[e][0]}>{m[e][1]}</Badge>;
};

const badgeRec = (e: EstadoRec) =>
  e === "CONFORME"
    ? <Badge className="bg-green-500/15 text-green-500 border-green-500/20">Conforme</Badge>
    : <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/20">Con Discrepancia</Badge>;

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Crear OT de Picking (F-LOG-01)
// Origen: OV confirmada desde Ventas. Datos del cliente y productos vienen en la OV.
// Logística solo asigna operador y fecha planificada.
// ─────────────────────────────────────────────────────────────────────────────

function ModalCrearOT({ open, onClose, ovsPendientes, onCrear }: {
  open: boolean; onClose: () => void;
  ovsPendientes: OrdenVenta[];
  onCrear: (ot: OTPicking) => void;
}) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [ovSel, setOvSel] = useState<OrdenVenta | null>(null);
  const [operador, setOperador] = useState("");
  const [fechaPlan, setFechaPlan] = useState(new Date().toISOString().split("T")[0]);
  const [err, setErr] = useState<Record<string, string>>({});

  useEffect(() => { if (!open) { setPaso(1); setOvSel(null); setOperador(""); setErr({}); } }, [open]);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!operador) e.op = "Requerido";
    if (!fechaPlan) e.fp = "Requerido";
    setErr(e); return !Object.keys(e).length;
  };

  const crear = () => {
    if (!validar() || !ovSel) return;
    const op = operadoresMock.find(o => o.id === operador)!;
    onCrear({
      id_ot: `OT-2026-${String(Math.floor(Math.random() * 900 + 100))}`,
      id_ov: ovSel.id_ov, cliente: ovSel.cliente,
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_planificada: fechaPlan,
      id_operador: op.id, nombre_operador: op.nombre.split(" (")[0],
      estado: "PENDIENTE", lineas: ovSel.lineas.map(l => ({ ...l })),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ClipboardList className="w-5 h-5 text-primary" /> Nueva OT de Picking
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs">
          {["Seleccionar OV", "Asignar operador"].map((lbl, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className={`flex items-center gap-1 ${paso === i + 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${paso === i + 1 ? "bg-primary text-primary-foreground border-primary" : paso > i + 1 ? "bg-green-500 text-white border-green-500" : "border-border"}`}>
                  {paso > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {lbl}
              </span>
            </span>
          ))}
        </div>

        {/* PASO 1: elegir OV */}
        {paso === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Las siguientes órdenes de venta confirmadas están pendientes de despacho.
              Selecciona una para crear la OT de picking.
            </p>
            {ovsPendientes.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-sm">
                No hay órdenes de venta pendientes de despacho.
              </div>
            )}
            {ovsPendientes.map(ov => (
              <div key={ov.id_ov}
                onClick={() => setOvSel(ov)}
                className={`rounded-lg border p-4 cursor-pointer transition-all ${ovSel?.id_ov === ov.id_ov ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/30"}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-primary font-semibold">{ov.id_ov}</span>
                      <Badge className="bg-green-500/15 text-green-500 border-green-500/20 text-xs">Confirmada</Badge>
                    </div>
                    <p className="font-semibold text-foreground mt-1">{ov.cliente}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {ov.direccion_entrega}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ov.fecha_emision} · {ov.lineas.length} líneas</p>
                  </div>
                  <p className="font-semibold text-foreground">{fmt(ov.monto_total)}</p>
                </div>
                {/* Líneas de la OV */}
                <div className="mt-3 rounded-md bg-secondary border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border">
                      <th className="text-left px-3 py-1.5 text-muted-foreground">Producto</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground">Cant.</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground">Stock</th>
                    </tr></thead>
                    <tbody>
                      {ov.lineas.map(l => {
                        const cat = mockCatalogo.find(p => p.codigo === l.codigo);
                        const ok = (cat?.stock ?? 0) >= l.cantidad_solicitada;
                        return (
                          <tr key={l.codigo} className="border-b border-border last:border-0">
                            <td className="px-3 py-1.5 text-foreground font-medium">{l.nombre}</td>
                            <td className="px-3 py-1.5 text-center text-foreground">{l.cantidad_solicitada}</td>
                            <td className={`px-3 py-1.5 text-center font-semibold ${ok ? "text-green-500" : "text-red-500"}`}>
                              {cat?.stock ?? 0}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 2: operador y fecha */}
        {paso === 2 && ovSel && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">OV seleccionada</p>
              <p className="font-semibold text-foreground">{ovSel.id_ov} · {ovSel.cliente}</p>
              <p className="text-xs text-muted-foreground">{ovSel.lineas.length} líneas · {fmt(ovSel.monto_total)}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Operador de Bodega *</label>
              <Select value={operador} onValueChange={setOperador}>
                <SelectTrigger className={err.op ? "border-red-500/50" : ""}>
                  <SelectValue placeholder="Seleccionar operador..." />
                </SelectTrigger>
                <SelectContent>
                  {operadoresMock.map(o => <SelectItem key={o.id} value={o.id}>{o.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
              {err.op && <p className="text-xs text-red-500">{err.op}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Fecha Planificada *</label>
              <Input type="date" value={fechaPlan} onChange={e => setFechaPlan(e.target.value)}
                className={err.fp ? "border-red-500/50" : ""} />
              {err.fp && <p className="text-xs text-red-500">{err.fp}</p>}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {paso === 1 && <Button disabled={!ovSel} onClick={() => setPaso(2)}>Siguiente <ChevronRight className="w-4 h-4 ml-1" /></Button>}
          {paso === 2 && (
            <>
              <Button variant="outline" onClick={() => setPaso(1)}>Atrás</Button>
              <Button onClick={crear}><CheckCircle2 className="w-4 h-4 mr-2" />Crear OT de Picking</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Confirmar Picking + Emitir Guía de Despacho (F-LOG-02)
// Valida cantidades confirmadas ≤ solicitadas, asigna transportista.
// ─────────────────────────────────────────────────────────────────────────────

function ModalConfirmarPicking({ ot, open, onClose, onConfirmar }: {
  ot: OTPicking | null; open: boolean; onClose: () => void;
  onConfirmar: (otId: string, guia: GuiaDespacho) => void;
}) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [transportista, setTransportista] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ot && open) {
      const init: Record<string, number> = {};
      ot.lineas.forEach(l => { init[l.codigo] = l.cantidad_solicitada; });
      setCantidades(init); setTransportista(""); setErr({});
    }
  }, [ot, open]);

  if (!ot) return null;

  const ovRef = mockOVs.find(o => o.id_ov === ot.id_ov);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!transportista) e.trn = "Requerido";
    ot.lineas.forEach(l => {
      const v = cantidades[l.codigo] ?? 0;
      if (v > l.cantidad_solicitada) e[l.codigo] = `Máx. ${l.cantidad_solicitada}`;
      if (v < 0) e[l.codigo] = "No puede ser negativo";
    });
    setErr(e); return !Object.keys(e).length;
  };

  const confirmar = () => {
    if (!validar()) return;
    const trn = mockTransportistas.find(t => t.id === transportista)!;
    const guia: GuiaDespacho = {
      id_guia: `GD-2026-${String(Math.floor(Math.random() * 900 + 100))}`,
      id_ot: ot.id_ot, id_ov: ot.id_ov, cliente: ot.cliente,
      nombre_transportista: trn.nombre, patente: trn.patente,
      direccion_entrega: ovRef?.direccion_entrega ?? "",
      fecha_emision: new Date().toISOString().split("T")[0],
      estado: "EMITIDA",
      lineas: ot.lineas.map(l => ({ ...l, cantidad_despachada: cantidades[l.codigo] ?? l.cantidad_solicitada })),
    };
    onConfirmar(ot.id_ot, guia);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ReceiptText className="w-5 h-5 text-primary" /> Confirmar Picking · Emitir Guía de Despacho
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info OT */}
          <div className="rounded-lg border border-border bg-secondary p-3 grid grid-cols-2 gap-2 text-sm">
            <div><p className="text-xs text-muted-foreground">OT</p><p className="font-mono font-semibold text-foreground">{ot.id_ot}</p></div>
            <div><p className="text-xs text-muted-foreground">OV Origen</p><p className="font-mono font-semibold text-foreground">{ot.id_ov}</p></div>
            <div><p className="text-xs text-muted-foreground">Cliente</p><p className="font-medium text-foreground">{ot.cliente}</p></div>
            <div><p className="text-xs text-muted-foreground">Dirección</p><p className="font-medium text-foreground text-xs">{ovRef?.direccion_entrega}</p></div>
            <div><p className="text-xs text-muted-foreground">Operador</p><p className="font-medium text-foreground">{ot.nombre_operador}</p></div>
          </div>

          {/* Verificación de cantidades */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Confirmar cantidades retiradas de bodega</p>
            <p className="text-xs text-muted-foreground mb-2">
              Verifica que las cantidades físicamente retiradas coincidan con la OV. Si hay diferencia, ajusta el valor.
            </p>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground uppercase">Producto</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Solicitado OV</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Confirmado</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Diff.</th>
                </tr></thead>
                <tbody>
                  {ot.lineas.map(l => {
                    const conf = cantidades[l.codigo] ?? l.cantidad_solicitada;
                    const diff = conf - l.cantidad_solicitada;
                    return (
                      <tr key={l.codigo} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          <p className="font-medium text-foreground text-xs">{l.nombre}</p>
                          <p className="text-xs text-muted-foreground font-mono">{l.codigo}</p>
                        </td>
                        <td className="px-3 py-2 text-center text-foreground font-medium">{l.cantidad_solicitada}</td>
                        <td className="px-3 py-2 text-center">
                          <Input type="number" min={0} max={l.cantidad_solicitada}
                            value={conf}
                            onChange={e => setCantidades(p => ({ ...p, [l.codigo]: Number(e.target.value) }))}
                            className={`w-20 mx-auto text-center h-8 ${err[l.codigo] ? "border-red-500/50" : ""}`} />
                          {err[l.codigo] && <p className="text-xs text-red-500">{err[l.codigo]}</p>}
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

          {/* Transportista */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Transportista *</label>
            <Select value={transportista} onValueChange={setTransportista}>
              <SelectTrigger className={err.trn ? "border-red-500/50" : ""}><SelectValue placeholder="Seleccionar transportista..." /></SelectTrigger>
              <SelectContent>
                {mockTransportistas.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre} · {t.patente} · {t.conductor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err.trn && <p className="text-xs text-red-500">{err.trn}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={confirmar}><ReceiptText className="w-4 h-4 mr-2" />Confirmar y Emitir Guía</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Confirmar Entrega al Cliente (desde Guía en tránsito)
// El cliente confirma las cantidades recibidas. Se detectan inconsistencias.
// ─────────────────────────────────────────────────────────────────────────────

function ModalConfirmarEntrega({ guia, open, onClose, onConfirmar }: {
  guia: GuiaDespacho | null; open: boolean; onClose: () => void;
  onConfirmar: (guiaId: string, lineas: LineaOV[], hayDiff: boolean) => void;
}) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  useEffect(() => {
    if (guia && open) {
      const init: Record<string, number> = {};
      guia.lineas.forEach(l => { init[l.codigo] = l.cantidad_despachada ?? l.cantidad_solicitada; });
      setCantidades(init);
    }
  }, [guia, open]);

  if (!guia) return null;

  const hayDiff = guia.lineas.some(l => (cantidades[l.codigo] ?? 0) !== (l.cantidad_despachada ?? l.cantidad_solicitada));

  const confirmar = () => {
    const lineas = guia.lineas.map(l => ({
      ...l,
      cantidad_confirmada_cliente: cantidades[l.codigo] ?? l.cantidad_despachada ?? l.cantidad_solicitada,
    }));
    onConfirmar(guia.id_guia, lineas, hayDiff);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <PackageCheck className="w-5 h-5 text-primary" /> Confirmar Recepción del Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary p-3 grid grid-cols-2 gap-2 text-sm">
            <div><p className="text-xs text-muted-foreground">Guía</p><p className="font-mono font-semibold text-foreground">{guia.id_guia}</p></div>
            <div><p className="text-xs text-muted-foreground">OV Origen</p><p className="font-mono font-semibold text-foreground">{guia.id_ov}</p></div>
            <div><p className="text-xs text-muted-foreground">Cliente</p><p className="font-medium text-foreground">{guia.cliente}</p></div>
            <div><p className="text-xs text-muted-foreground">Transportista</p><p className="font-medium text-foreground text-xs">{guia.nombre_transportista} · {guia.patente}</p></div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">Cantidades confirmadas por el cliente</p>
            <p className="text-xs text-muted-foreground mb-2">
              Ingresa las cantidades que el cliente confirma haber recibido. Cualquier diferencia con lo despachado quedará registrada.
            </p>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground uppercase">Producto</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Despachado</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Recibido Cliente</th>
                  <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Diff.</th>
                </tr></thead>
                <tbody>
                  {guia.lineas.map(l => {
                    const desp = l.cantidad_despachada ?? l.cantidad_solicitada;
                    const rec = cantidades[l.codigo] ?? desp;
                    const diff = rec - desp;
                    return (
                      <tr key={l.codigo} className="border-b border-border last:border-0">
                        <td className="px-3 py-2"><p className="font-medium text-foreground text-xs">{l.nombre}</p><p className="font-mono text-xs text-muted-foreground">{l.codigo}</p></td>
                        <td className="px-3 py-2 text-center font-medium text-foreground">{desp}</td>
                        <td className="px-3 py-2 text-center">
                          <Input type="number" min={0} max={desp}
                            value={rec}
                            onChange={e => setCantidades(p => ({ ...p, [l.codigo]: Number(e.target.value) }))}
                            className="w-20 mx-auto text-center h-8" />
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

          {hayDiff && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-500">Se detectaron diferencias entre lo despachado y lo recibido. La OV quedará marcada como <strong>Entregada con Diferencia</strong>.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={confirmar} className={hayDiff ? "bg-red-600 hover:bg-red-700" : ""}>
            {hayDiff ? <><PackageX className="w-4 h-4 mr-2" />Registrar con Diferencia</> : <><PackageCheck className="w-4 h-4 mr-2" />Confirmar Entrega Conforme</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Registrar Recepción de Mercadería (F-LOG-03)
// Origen: OC aprobada desde Compras. Datos del proveedor y productos en la OC.
// ─────────────────────────────────────────────────────────────────────────────

function ModalRegistrarRecepcion({ open, onClose, ocsPendientes, onRegistrar }: {
  open: boolean; onClose: () => void;
  ocsPendientes: OrdenCompra[];
  onRegistrar: (rec: RecepcionMercaderia, ocId: string, estado: EstadoOC) => void;
}) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [ocSel, setOcSel] = useState<OrdenCompra | null>(null);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [operador, setOperador] = useState("");
  const [obs, setObs] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});

  useEffect(() => { if (!open) { setPaso(1); setOcSel(null); setCantidades({}); setOperador(""); setObs(""); setErr({}); } }, [open]);
  useEffect(() => {
    if (ocSel) {
      const init: Record<string, number> = {};
      ocSel.lineas.forEach(l => { init[l.codigo] = l.cantidad_solicitada; });
      setCantidades(init);
    }
  }, [ocSel]);

  const hayDiff = ocSel?.lineas.some(l => (cantidades[l.codigo] ?? 0) !== l.cantidad_solicitada) ?? false;

  const validar = () => {
    const e: Record<string, string> = {};
    if (!operador) e.op = "Requerido";
    ocSel?.lineas.forEach(l => { if ((cantidades[l.codigo] ?? 0) < 0) e[l.codigo] = "Valor inválido"; });
    setErr(e); return !Object.keys(e).length;
  };

  const registrar = () => {
    if (!validar() || !ocSel) return;
    const op = operadoresMock.find(o => o.id === operador)!;
    const rec: RecepcionMercaderia = {
      id_recepcion: `REC-2026-${String(Math.floor(Math.random() * 900 + 100))}`,
      id_oc: ocSel.id_oc, proveedor: ocSel.proveedor,
      fecha_recepcion: new Date().toISOString().split("T")[0],
      nombre_operador: op.nombre.split(" (")[0],
      estado: hayDiff ? "CON_DISCREPANCIA" : "CONFORME", observaciones: obs,
      lineas: ocSel.lineas.map(l => ({ ...l, cantidad_recibida: cantidades[l.codigo] ?? l.cantidad_solicitada })),
    };
    onRegistrar(rec, ocSel.id_oc, hayDiff ? "RECIBIDA_CON_DIFF" : "RECIBIDA_CONFORME");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ArrowDownToLine className="w-5 h-5 text-primary" /> Registrar Recepción de Mercadería
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-xs">
          {["Seleccionar OC", "Verificar cantidades"].map((lbl, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className={`flex items-center gap-1 ${paso === i + 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${paso === i + 1 ? "bg-primary text-primary-foreground border-primary" : paso > i + 1 ? "bg-green-500 text-white border-green-500" : "border-border"}`}>
                  {paso > i + 1 ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {lbl}
              </span>
            </span>
          ))}
        </div>

        {/* PASO 1: elegir OC */}
        {paso === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Órdenes de compra aprobadas pendientes de recepción. Los datos del proveedor y cantidades vienen en cada OC.
            </p>
            {ocsPendientes.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-sm">
                No hay órdenes de compra pendientes de recepción.
              </div>
            )}
            {ocsPendientes.map(oc => (
              <div key={oc.id_oc}
                onClick={() => setOcSel(oc)}
                className={`rounded-lg border p-4 cursor-pointer transition-all ${ocSel?.id_oc === oc.id_oc ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/30"}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-mono text-xs text-primary font-semibold">{oc.id_oc}</span>
                    <p className="font-semibold text-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> {oc.proveedor}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{oc.fecha_emision} · {oc.lineas.length} productos</p>
                  </div>
                  <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/20">Pendiente Recepción</Badge>
                </div>
                <div className="mt-3 space-y-0.5">
                  {oc.lineas.map(l => (
                    <div key={l.codigo} className="flex justify-between text-xs text-muted-foreground">
                      <span>{l.nombre}</span>
                      <span>OC: <span className="text-foreground font-medium">{l.cantidad_solicitada}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 2: verificar cantidades */}
        {paso === 2 && ocSel && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary p-3">
              <p className="text-xs text-muted-foreground">OC seleccionada · {ocSel.proveedor}</p>
              <p className="font-mono font-semibold text-foreground">{ocSel.id_oc}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">Verificación de cantidades físicas recibidas</p>
              <p className="text-xs text-muted-foreground mb-2">
                Compara lo que llegó físicamente contra la OC. Modifica la cantidad recibida si hay diferencia.
              </p>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left px-3 py-2 text-xs text-muted-foreground uppercase">Producto</th>
                    <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">OC</th>
                    <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Recibido</th>
                    <th className="text-center px-3 py-2 text-xs text-muted-foreground uppercase">Diff.</th>
                  </tr></thead>
                  <tbody>
                    {ocSel.lineas.map(l => {
                      const rec = cantidades[l.codigo] ?? l.cantidad_solicitada;
                      const diff = rec - l.cantidad_solicitada;
                      return (
                        <tr key={l.codigo} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">
                            <p className="font-medium text-foreground text-xs">{l.nombre}</p>
                            <p className="font-mono text-xs text-muted-foreground">{l.codigo}</p>
                          </td>
                          <td className="px-3 py-2 text-center font-medium text-foreground">{l.cantidad_solicitada}</td>
                          <td className="px-3 py-2 text-center">
                            <Input type="number" min={0}
                              value={rec}
                              onChange={e => setCantidades(p => ({ ...p, [l.codigo]: Number(e.target.value) }))}
                              className="w-20 mx-auto text-center h-8" />
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

            {hayDiff && (
              <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-3 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500">Hay diferencias en las cantidades. La recepción quedará marcada como <strong>Con Discrepancia</strong>.</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Operador que Recibe *</label>
              <Select value={operador} onValueChange={setOperador}>
                <SelectTrigger className={err.op ? "border-red-500/50" : ""}><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>{operadoresMock.map(o => <SelectItem key={o.id} value={o.id}>{o.nombre}</SelectItem>)}</SelectContent>
              </Select>
              {err.op && <p className="text-xs text-red-500">{err.op}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Observaciones</label>
              <textarea value={obs} onChange={e => setObs(e.target.value)}
                placeholder="Detalle discrepancias, daños o incidencias en la recepción..."
                className="w-full min-h-[72px] px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {paso === 1 && <Button disabled={!ocSel} onClick={() => setPaso(2)}>Siguiente <ChevronRight className="w-4 h-4 ml-1" /></Button>}
          {paso === 2 && (
            <>
              <Button variant="outline" onClick={() => setPaso(1)}>Atrás</Button>
              <Button onClick={registrar}>
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                {hayDiff ? "Registrar con Discrepancia" : "Confirmar Recepción"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Logistica() {
  const [ots, setOts]           = useState<OTPicking[]>(mockOTs);
  const [guias, setGuias]       = useState<GuiaDespacho[]>(mockGuias);
  const [recepciones, setRec]   = useState<RecepcionMercaderia[]>(mockRecepciones);
  const [ocs, setOcs]           = useState<OrdenCompra[]>(mockOCs);
  const [ovs, setOvs]           = useState<OrdenVenta[]>(mockOVs);


  const [crearOTOpen, setCrearOTOpen]         = useState(false);
  const [confirmarOT, setConfirmarOT]         = useState<OTPicking | null>(null);
  const [confirmarEntrega, setConfirmarEntrega] = useState<GuiaDespacho | null>(null);
  const [recepcionOpen, setRecepcionOpen]     = useState(false);
  const [detalleItem, setDetalleItem]         = useState<{ tipo: "ot" | "guia" | "rec" | "ov" | "oc"; data: unknown } | null>(null);


  const [searchOT,   setSearchOT]   = useState("");
  const [filtroOT,   setFiltroOT]   = useState("todos");
  const [searchOV,   setSearchOV]   = useState("");
  const [filtroOV,   setFiltroOV]   = useState("todos");
  const [searchOC,   setSearchOC]   = useState("");


  const ovsPendientesDespacho = ovs.filter(o => o.estado === "PENDIENTE_DESPACHO");
  const ocsPendientesRecepcion = ocs.filter(o => o.estado === "PENDIENTE_RECEPCION");

  const otsFiltradas = ots.filter(o => {
    const m = `${o.id_ot} ${o.id_ov} ${o.cliente} ${o.nombre_operador}`.toLowerCase().includes(searchOT.toLowerCase());
    return m && (filtroOT === "todos" || o.estado === filtroOT);
  });

  const ovsFiltradas = ovs.filter(o => {
    const m = `${o.id_ov} ${o.cliente}`.toLowerCase().includes(searchOV.toLowerCase());
    return m && (filtroOV === "todos" || o.estado === filtroOV);
  });

  const ocsFiltradas = ocs.filter(o =>
    `${o.id_oc} ${o.proveedor}`.toLowerCase().includes(searchOC.toLowerCase())
  );


  const otsPend    = ots.filter(o => o.estado === "PENDIENTE").length;
  const otsProc    = ots.filter(o => o.estado === "EN_PROCESO").length;
  const guiasTrans = guias.filter(g => g.estado === "EN_TRANSITO").length;
  const recDiff    = recepciones.filter(r => r.estado === "CON_DISCREPANCIA").length;



  const handleCrearOT = (ot: OTPicking) => {
    setOts(p => [ot, ...p]);
    setOvs(p => p.map(o => o.id_ov === ot.id_ov ? { ...o, estado: "DESPACHADA" } : o));
  };

  const handleConfirmarPicking = (otId: string, guia: GuiaDespacho) => {
    setOts(p => p.map(o => o.id_ot === otId ? { ...o, estado: "COMPLETADA" } : o));
    setGuias(p => [guia, ...p]);
  };

  const handleConfirmarEntrega = (guiaId: string, lineas: LineaOV[], hayDiff: boolean) => {
    const guia = guias.find(g => g.id_guia === guiaId);
    if (!guia) return;
    setGuias(p => p.map(g => g.id_guia === guiaId ? { ...g, estado: "ENTREGADA", lineas } : g));
    setOvs(p => p.map(o => o.id_ov === guia.id_ov
      ? { ...o, estado: hayDiff ? "ENTREGADA_CON_DIFF" : "ENTREGADA_CONFORME", lineas }
      : o));
  };

  const handleRegistrarRecepcion = (rec: RecepcionMercaderia, ocId: string, estado: EstadoOC) => {
    setRec(p => [rec, ...p]);
    setOcs(p => p.map(o => o.id_oc === ocId ? { ...o, estado } : o));
  };

  const handleAvanzarGuia = (id: string, estado: EstadoGuia) =>
    setGuias(p => p.map(g => g.id_guia === id ? { ...g, estado } : g));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">


      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logística / Despacho</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestión operativa de despachos (OV desde Ventas) y recepciones (OC desde Compras)
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setRecepcionOpen(true)}>
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Registrar Recepción
          </Button>
          <Button onClick={() => setCrearOTOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nueva OT de Picking
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList}  label="OTs Pendientes"      value={otsPend + otsProc} sub="picking por ejecutar"       color="text-yellow-500" />
        <StatCard icon={Truck}          label="Guías en Tránsito"   value={guiasTrans}        sub="en camino al cliente"        color="text-blue-400"   />
        <StatCard icon={Package}        label="OVs sin Despachar"   value={ovsPendientesDespacho.length} sub="requieren OT"    color="text-primary"    />
        <StatCard icon={ShieldAlert}    label="OCs con Discrepancia" value={recDiff}          sub="pendientes seguimiento"      color="text-red-500"    />
      </div>


      <Tabs defaultValue="despacho" className="space-y-4">
        <TabsList className="bg-secondary border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="despacho" className="gap-1.5">
            <ArrowUpFromLine className="w-4 h-4" /> Despachos
            {(otsPend + otsProc) > 0 && <span className="bg-yellow-500/20 text-yellow-500 text-xs px-1.5 rounded-full">{otsPend + otsProc}</span>}
          </TabsTrigger>
          <TabsTrigger value="ordenes_venta" className="gap-1.5">
            <ReceiptText className="w-4 h-4" /> Órdenes de Venta
          </TabsTrigger>
          <TabsTrigger value="recepciones" className="gap-1.5">
            <ArrowDownToLine className="w-4 h-4" /> Recepciones
            {recDiff > 0 && <span className="bg-red-500/20 text-red-500 text-xs px-1.5 rounded-full">{recDiff}</span>}
          </TabsTrigger>
          <TabsTrigger value="ordenes_compra" className="gap-1.5">
            <Package className="w-4 h-4" /> Órdenes de Compra
          </TabsTrigger>
          <TabsTrigger value="transportistas" className="gap-1.5">
            <Truck className="w-4 h-4" /> Transportistas
          </TabsTrigger>
        </TabsList>


        <TabsContent value="despacho" className="space-y-6">


          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" /> Órdenes de Trabajo – Picking
              </h2>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar OT, OV, cliente..." className="pl-9 w-56" value={searchOT} onChange={e => setSearchOT(e.target.value)} />
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
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  {["ID OT","OV Origen","Cliente","Operador","F. Planificada","Líneas","Estado","Acciones"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {otsFiltradas.length === 0
                    ? <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">Sin resultados.</td></tr>
                    : otsFiltradas.map(ot => (
                      <tr key={ot.id_ot} className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{ot.id_ot}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ot.id_ov}</td>
                        <td className="px-4 py-3 font-medium text-foreground max-w-[130px] truncate">{ot.cliente}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{ot.nombre_operador}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{ot.fecha_planificada}</td>
                        <td className="px-4 py-3 text-center text-foreground">{ot.lineas.length}</td>
                        <td className="px-4 py-3">{badgeOT(ot.estado)}</td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetalleItem({ tipo: "ot", data: ot })}>
                                <Eye className="w-4 h-4 mr-2" />Ver detalle
                              </DropdownMenuItem>
                              {(ot.estado === "PENDIENTE" || ot.estado === "EN_PROCESO") && (
                                <DropdownMenuItem onClick={() => setConfirmarOT(ot)}>
                                  <BadgeCheck className="w-4 h-4 mr-2 text-primary" />Confirmar Picking
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
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-primary" /> Guías de Despacho
            </h2>
            {guias.length === 0
              ? <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">No hay guías emitidas.</div>
              : <div className="space-y-3">
                {guias.map(g => (
                  <div key={g.id_guia} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                          <ReceiptText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm text-primary font-semibold">{g.id_guia}</span>
                            <span className="font-mono text-xs text-muted-foreground">OT: {g.id_ot}</span>
                            <span className="font-mono text-xs text-muted-foreground">OV: {g.id_ov}</span>
                            {badgeGuia(g.estado)}
                          </div>
                          <p className="font-semibold text-foreground mt-1">{g.cliente}</p>
                          <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" />{g.nombre_transportista} · {g.patente}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{g.direccion_entrega}</span>
                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />Emitida: {g.fecha_emision}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {g.estado === "EMITIDA" && (
                          <Button size="sm" variant="outline" onClick={() => handleAvanzarGuia(g.id_guia, "EN_TRANSITO")}>
                            <Truck className="w-3.5 h-3.5 mr-1" />Marcar En Tránsito
                          </Button>
                        )}
                        {g.estado === "EN_TRANSITO" && (
                          <Button size="sm" onClick={() => setConfirmarEntrega(g)}>
                            <PackageCheck className="w-3.5 h-3.5 mr-1" />Confirmar Entrega
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </TabsContent>

        <TabsContent value="ordenes_venta" className="space-y-4">
          <p className="text-xs text-muted-foreground bg-secondary border border-border rounded-lg px-3 py-2">
            Las órdenes de venta son generadas por el módulo de <strong className="text-foreground">Ventas</strong>. Logística las recibe para coordinar el despacho y registrar la confirmación del cliente.
          </p>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar OV o cliente..." className="pl-9" value={searchOV} onChange={e => setSearchOV(e.target.value)} />
            </div>
            <Select value={filtroOV} onValueChange={setFiltroOV}>
              <SelectTrigger className="w-52"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="PENDIENTE_DESPACHO">Pendiente Despacho</SelectItem>
                <SelectItem value="DESPACHADA">Despachada</SelectItem>
                <SelectItem value="ENTREGADA_CONFORME">Entregada Conforme</SelectItem>
                <SelectItem value="ENTREGADA_CON_DIFF">Entregada c/ Diferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {ovsFiltradas.map(ov => (
              <div key={ov.id_ov} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-primary font-semibold">{ov.id_ov}</span>
                      {badgeOV(ov.estado)}
                    </div>
                    <p className="font-semibold text-foreground mt-1">{ov.cliente}</p>
                    <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ov.direccion_entrega}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{ov.fecha_emision}</span>
                      <span className="font-medium text-foreground">{fmt(ov.monto_total)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-border bg-secondary overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border">
                      <th className="text-left px-3 py-1.5 text-muted-foreground uppercase">Producto</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">Solicitado</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">Despachado</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">Confirmado Cliente</th>
                    </tr></thead>
                    <tbody>
                      {ov.lineas.map(l => {
                        const diffEnv = (l.cantidad_despachada ?? 0) - l.cantidad_solicitada;
                        const diffRec = l.cantidad_confirmada_cliente !== undefined
                          ? l.cantidad_confirmada_cliente - (l.cantidad_despachada ?? l.cantidad_solicitada) : null;
                        return (
                          <tr key={l.codigo} className="border-b border-border last:border-0">
                            <td className="px-3 py-1.5 font-medium text-foreground">{l.nombre}</td>
                            <td className="px-3 py-1.5 text-center text-foreground">{l.cantidad_solicitada}</td>
                            <td className="px-3 py-1.5 text-center">
                              {l.cantidad_despachada !== undefined
                                ? <span className={diffEnv === 0 ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>{l.cantidad_despachada}</span>
                                : <span className="text-muted-foreground">—</span>}
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              {l.cantidad_confirmada_cliente !== undefined
                                ? <span className={diffRec === 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{l.cantidad_confirmada_cliente}</span>
                                : <span className="text-muted-foreground">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {ov.estado === "ENTREGADA_CON_DIFF" && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Diferencias detectadas entre lo despachado y lo confirmado por el cliente.
                  </p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recepciones" className="space-y-4">
          {recepciones.length === 0
            ? <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">No hay recepciones registradas.</div>
            : recepciones.map(rec => (
              <div key={rec.id_recepcion} className="rounded-xl border border-border bg-card p-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <ArrowDownToLine className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-primary font-semibold">{rec.id_recepcion}</span>
                      <span className="font-mono text-xs text-muted-foreground">OC: {rec.id_oc}</span>
                      {badgeRec(rec.estado)}
                    </div>
                    <p className="font-semibold text-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />{rec.proveedor}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{rec.nombre_operador}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{rec.fecha_recepcion}</span>
                    </div>
                    {rec.observaciones && (
                      <p className="text-xs text-yellow-500 mt-1 flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />{rec.observaciones}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-border bg-secondary overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border">
                      <th className="text-left px-3 py-1.5 text-muted-foreground uppercase">Producto</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">OC</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">Recibido</th>
                      <th className="text-center px-3 py-1.5 text-muted-foreground uppercase">Diff.</th>
                    </tr></thead>
                    <tbody>
                      {rec.lineas.map(l => {
                        const diff = (l.cantidad_recibida ?? 0) - l.cantidad_solicitada;
                        return (
                          <tr key={l.codigo} className="border-b border-border last:border-0">
                            <td className="px-3 py-1.5 font-medium text-foreground">{l.nombre}</td>
                            <td className="px-3 py-1.5 text-center text-foreground">{l.cantidad_solicitada}</td>
                            <td className="px-3 py-1.5 text-center text-foreground">{l.cantidad_recibida ?? "—"}</td>
                            <td className="px-3 py-1.5 text-center font-semibold">
                              {diff === 0
                                ? <span className="text-green-500 flex justify-center"><Check className="w-3.5 h-3.5" /></span>
                                : <span className={diff < 0 ? "text-red-500" : "text-yellow-500"}>{diff > 0 ? "+" : ""}{diff}</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          }
        </TabsContent>

        <TabsContent value="ordenes_compra" className="space-y-4">
          <p className="text-xs text-muted-foreground bg-secondary border border-border rounded-lg px-3 py-2">
            Las órdenes de compra son generadas por el módulo de <strong className="text-foreground">Compras</strong>. Logística las recibe para verificar y registrar la entrada de mercadería al inventario.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar OC o proveedor..." className="pl-9 max-w-sm" value={searchOC} onChange={e => setSearchOC(e.target.value)} />
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                {["ID OC","Proveedor","Fecha Emisión","Líneas","Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ocsFiltradas.map(oc => (
                  <tr key={oc.id_oc} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{oc.id_oc}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{oc.proveedor}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{oc.fecha_emision}</td>
                    <td className="px-4 py-3 text-center text-foreground">{oc.lineas.length}</td>
                    <td className="px-4 py-3">{badgeOC(oc.estado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="transportistas" className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Maestro de Transportistas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{mockTransportistas.length} transportistas disponibles</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                {["ID","Empresa","Conductor","Patente","Teléfono","Guías Asignadas"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {mockTransportistas.map(t => {
                  const asignadas = guias.filter(g => g.nombre_transportista === t.nombre).length;
                  return (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{t.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs flex items-center gap-1.5 mt-2">
                        <User className="w-3.5 h-3.5" />{t.conductor}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-foreground">{t.patente}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5" />{t.telefono}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px] bg-secondary rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(asignadas / Math.max(guias.length, 1)) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{asignadas}</span>
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

      {/* ── Modals ── */}
      <ModalCrearOT
        open={crearOTOpen} onClose={() => setCrearOTOpen(false)}
        ovsPendientes={ovsPendientesDespacho}
        onCrear={handleCrearOT}
      />

      <ModalConfirmarPicking
        ot={confirmarOT} open={!!confirmarOT}
        onClose={() => setConfirmarOT(null)}
        onConfirmar={handleConfirmarPicking}
      />

      <ModalConfirmarEntrega
        guia={confirmarEntrega} open={!!confirmarEntrega}
        onClose={() => setConfirmarEntrega(null)}
        onConfirmar={handleConfirmarEntrega}
      />

      <ModalRegistrarRecepcion
        open={recepcionOpen} onClose={() => setRecepcionOpen(false)}
        ocsPendientes={ocsPendientesRecepcion}
        onRegistrar={handleRegistrarRecepcion}
      />
    </div>
  );
}