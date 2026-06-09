/**
 * hooks/logistica/logisticaHooks.ts
 *
 * Todos los hooks del módulo Logística.
 * Importar en LogisticaPage.tsx y eliminar las definiciones locales equivalentes.
 *
 * Uso:
 *   import { useOrdenesCompra, useRegistrarRecepcion, ... } from "@/hooks/logistica/logisticaHooks";
 *
 * Switches:
 *   USE_MOCK        → false cuando el backend propio esté listo
 *   USE_MOCK_VENTAS → false cuando el módulo de Ventas entregue su endpoint
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

// ─── SWITCHES ─────────────────────────────────────────────────────────────────
export const USE_MOCK        = true; // backend propio
export const USE_MOCK_VENTAS = true; // módulo externo Ventas

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface DetalleOC {
  id: string;                      
  id_producto: string;             
  nombre_producto: string;
  cantidad: number;                
  cantidad_recibida: number | null; 
  precio_unitario: number;
}

export interface OrdenCompra {
  id: string;           
  detalles: DetalleOC[];
  fecha_creacion: string; 
  estado: string;         
  total: number;
  id_usuario: string;     
}


export interface DetalleOV {
  id_producto: string;   
  nombre_producto: string;
  cantidad: number;
}

export interface OrdenVenta {
  id_pedido_venta: string;  
  cliente: string;
  id_direccion: number;   
  direccion_entrega: string;
  fecha_emision: string;    
  monto_total: number;
  detalles: DetalleOV[];
}

export interface OTPicking {
  id_ot: string;
  id_pedido_venta: string;  
  id_empleado: string;      
  nombre_empleado: string;  
  fecha_creacion: string;   
  estado: "PENDIENTE" | "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
}

export interface GuiaDespacho {
  id_guia: string;
  id_ot: string;                 
  id_transportista: string;      
  nombre_transportista: string;  
  patente_vehiculo: string;      
  id_direccion: number;          
  direccion: string;             
  fecha_emision: string;         
}

export interface Recepcion {
  id_recepcion: string;
  id_orden_compra: string;  
  id_empleado: string;      
  nombre_empleado: string;  
  fecha_recepcion: string;  
}

export interface Transportista {
  id_transportista: string;
  nombre_transp: string;
  patente_vehiculo: string;
  id_empleado: string;       
  nombre_empleado: string;   
}

export interface Direccion {
  id_direccion: number;
  direccion: string;
  id_cliente: string;  
}

export interface Operador {
  id_empleado: string;
  nombre: string;  
}



export interface CrearOTDto {
  id_pedido_venta: string; 
  id_empleado: string;     
}

export interface ActualizarEstadoOTDto {
  id_ot: string;
  estado: "EN_PROCESO" | "COMPLETADA" | "CANCELADA";
}

export interface CrearGuiaDto {
  id_ot: string;
  id_transportista: string;
  id_direccion: number;
}

export interface RegistrarRecepcionDto {
  id_orden_compra: string;  
  id_empleado: string;      
  detalles: {
    id_producto: string;    
    cantidad_recibida: number;
  }[];
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_OCS: OrdenCompra[] = [
  {
    id: "3ee36a36-2f91-497e-b4ab-b0082806302a",
    fecha_creacion: "2026-06-02T00:59:31.341Z",
    estado: "ENVIADA", total: 30000, id_usuario: "usr-compras-01",
    detalles: [
      { id: "det-001", id_producto: "860f8184-7839-4df3-92d1-ab1960449030", nombre_producto: "Notebook Lenovo",   cantidad: 2, cantidad_recibida: null, precio_unitario: 15000 },
      { id: "det-002", id_producto: "9a2b3c4d-1234-5678-abcd-ef0123456789", nombre_producto: "Mouse inalámbrico", cantidad: 5, cantidad_recibida: null, precio_unitario: 0 },
    ],
  },
  {
    id: "7fa12b45-8c3d-4e9f-a1b2-c3d4e5f60718",
    fecha_creacion: "2026-06-01T14:30:00.000Z",
    estado: "ENVIADA", total: 12000, id_usuario: "usr-compras-02",
    detalles: [
      { id: "det-003", id_producto: "aabbccdd-eeff-1122-3344-556677889900", nombre_producto: "Teclado mecánico", cantidad: 3, cantidad_recibida: null, precio_unitario: 4000 },
    ],
  },
];

const MOCK_RECEPCIONES: Recepcion[] = [
  { id_recepcion: "REC-001", id_orden_compra: "oc-anterior-uuid", id_empleado: "EMP-001", nombre_empleado: "Carlos Riquelme Soto", fecha_recepcion: "2026-05-22" },
];

const MOCK_OVS: OrdenVenta[] = [
  {
    id_pedido_venta: "PED-2026-00847", cliente: "Constructora Pérez & Hijos",
    id_direccion: 1, direccion_entrega: "Av. Principal 1234, Santiago",
    fecha_emision: "2026-05-20", monto_total: 847500,
    detalles: [
      { id_producto: "PRD-001", nombre_producto: "Taladro percutor 750W Bosch",     cantidad: 2 },
      { id_producto: "PRD-002", nombre_producto: "Set brocas acero inox 10 piezas", cantidad: 5 },
    ],
  },
  {
    id_pedido_venta: "PED-2026-00858", cliente: "Inmobiliaria Sur S.A.",
    id_direccion: 3, direccion_entrega: "Los Almendros 890, Las Condes",
    fecha_emision: "2026-05-25", monto_total: 680000,
    detalles: [
      { id_producto: "PRD-003", nombre_producto: "Cinta métrica 10m Stanley",        cantidad: 5  },
      { id_producto: "PRD-006", nombre_producto: "Cinta aislante negra pack x10",    cantidad: 15 },
    ],
  },
];

const MOCK_OTS: OTPicking[] = [
  { id_ot: "OT-2026-001", id_pedido_venta: "PED-2026-00831", id_empleado: "EMP-001", nombre_empleado: "Carlos Riquelme Soto", fecha_creacion: "2026-05-20", estado: "COMPLETADA" },
  { id_ot: "OT-2026-002", id_pedido_venta: "PED-2026-00847", id_empleado: "EMP-001", nombre_empleado: "Carlos Riquelme Soto", fecha_creacion: "2026-05-21", estado: "PENDIENTE"  },
];

const MOCK_GUIAS: GuiaDespacho[] = [
  { id_guia: "GD-2026-001", id_ot: "OT-2026-001", id_transportista: "TRN-001", nombre_transportista: "TransRapid Ltda.", patente_vehiculo: "BBTK-12", id_direccion: 1, direccion: "Av. Principal 1234, Santiago", fecha_emision: "2026-05-22" },
];

const MOCK_TRANSPORTISTAS: Transportista[] = [
  { id_transportista: "TRN-001", nombre_transp: "TransRapid Ltda.", patente_vehiculo: "BBTK-12", id_empleado: "EMP-002", nombre_empleado: "María González Pérez" },
  { id_transportista: "TRN-002", nombre_transp: "LogiExpress S.A.", patente_vehiculo: "CCPL-34", id_empleado: "EMP-002", nombre_empleado: "María González Pérez" },
  { id_transportista: "TRN-003", nombre_transp: "FleteSeguro SpA",  patente_vehiculo: "DDMN-56", id_empleado: "EMP-002", nombre_empleado: "María González Pérez" },
];

const MOCK_DIRECCIONES: Direccion[] = [
  { id_direccion: 1, direccion: "Av. Principal 1234, Santiago",     id_cliente: "CLI-001" },
  { id_direccion: 2, direccion: "Calle Los Pinos 567, Providencia", id_cliente: "CLI-002" },
  { id_direccion: 3, direccion: "Los Almendros 890, Las Condes",    id_cliente: "CLI-003" },
];

const MOCK_OPERADORES: Operador[] = [
  { id_empleado: "EMP-001", nombre: "Carlos Riquelme Soto (EMP-001)"    },
  { id_empleado: "EMP-006", nombre: "Valentina Rojas Herrera (EMP-006)" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

/**
 * useOrdenesCompra
 * Obtiene las OCs en estado "ENVIADA" del módulo Compras.
 * El backend actúa como proxy: llama a GET /buy-order/sended del módulo Compras
 * y reexpone los datos al frontend.
 *
 * GET /logistica/ordenes-compra
 * Response: OrdenCompra[]
 */
export function useOrdenesCompra() {
  return useQuery<OrdenCompra[]>({
    queryKey: ["log_ordenes_compra"],
    refetchInterval: USE_MOCK ? false : 30_000, // polling cada 30s en real
    queryFn: async () => {
      if (USE_MOCK) return MOCK_OCS;
      return (await api.get("/logistica/ordenes-compra")).data;
    },
  });
}

/**
 * useRegistrarRecepcion
 * Registra la recepción de una OC. Hace dos cosas en el backend:
 *   1. Llama PATCH /buy-order/:id del módulo Compras con las cantidades reales
 *   2. Inserta en log_recepcion (id_orden_compra, id_empleado, fecha_recepcion)
 *   (Lo que el backend haga internamente con Inventario es su responsabilidad)
 *
 * POST /logistica/recepciones
 * Body: RegistrarRecepcionDto
 * Response: Recepcion (el registro creado en log_recepcion con JOIN de nombre_empleado)
 */
export function useRegistrarRecepcion(
  onSuccess?: () => void,
  onError?: (msg: string) => void,
) {
  const qc = useQueryClient();
  return useMutation<Recepcion, Error, RegistrarRecepcionDto>({
    mutationFn: async (body) => {
      if (USE_MOCK) {
        return {
          id_recepcion: `REC-${String(Date.now()).slice(-4)}`,
          id_orden_compra: body.id_orden_compra,
          id_empleado: body.id_empleado,
          nombre_empleado: MOCK_OPERADORES.find(o => o.id_empleado === body.id_empleado)
            ?.nombre.split(" (")[0] ?? "",
          fecha_recepcion: new Date().toISOString().split("T")[0],
        };
      }
      return (await api.post("/logistica/recepciones", body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["log_ordenes_compra"] });
      qc.invalidateQueries({ queryKey: ["log_recepciones"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al registrar recepción.");
    },
  });
}

/**
 * useRecepciones
 * Lee el historial de recepciones propias (log_recepcion) con JOIN a RRHH_empleado.
 *
 * GET /logistica/recepciones
 * Response: Recepcion[]
 */
export function useRecepciones() {
  return useQuery<Recepcion[]>({
    queryKey: ["log_recepciones"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_RECEPCIONES;
      return (await api.get("/logistica/recepciones")).data;
    },
  });
}

/**
 * useOrdenesVenta
 * Obtiene las OVs confirmadas del módulo Ventas.
 * En modo mock usa datos de demostración.
 * En modo real el backend proxy llama al endpoint de Ventas.
 *
 * GET /logistica/ordenes-venta
 * Response: OrdenVenta[]
 *
 * ⚠ Mantener USE_MOCK_VENTAS = true hasta confirmar el endpoint de Ventas.
 */
export function useOrdenesVenta() {
  return useQuery<OrdenVenta[]>({
    queryKey: ["log_ordenes_venta"],
    queryFn: async () => {
      if (USE_MOCK_VENTAS) return MOCK_OVS;
      return (await api.get("/logistica/ordenes-venta")).data;
    },
  });
}

/**
 * useOTsPicking
 * Lee los registros de log_picking con JOIN a RRHH_empleado para nombre_empleado.
 *
 * GET /logistica/ots-picking
 * Response: OTPicking[]
 */
export function useOTsPicking() {
  return useQuery<OTPicking[]>({
    queryKey: ["log_ots"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_OTS;
      return (await api.get("/logistica/ots-picking")).data;
    },
  });
}

/**
 * useCrearOT
 * Inserta en log_picking con estado PENDIENTE y fecha_creacion = now().
 *
 * POST /logistica/ots-picking
 * Body: CrearOTDto
 * Response: OTPicking (el registro creado con nombre_empleado del JOIN)
 */
export function useCrearOT(
  onSuccess?: () => void,
  onError?: (msg: string) => void,
) {
  const qc = useQueryClient();
  return useMutation<OTPicking, Error, CrearOTDto>({
    mutationFn: async (body) => {
      if (USE_MOCK) {
        return {
          ...body,
          id_ot: `OT-${String(Date.now()).slice(-4)}`,
          nombre_empleado: MOCK_OPERADORES.find(o => o.id_empleado === body.id_empleado)
            ?.nombre.split(" (")[0] ?? "",
          fecha_creacion: new Date().toISOString().split("T")[0],
          estado: "PENDIENTE" as const,
        };
      }
      return (await api.post("/logistica/ots-picking", body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["log_ots"] });
      qc.invalidateQueries({ queryKey: ["log_ordenes_venta"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al crear OT.");
    },
  });
}

/**
 * useActualizarEstadoOT
 * Actualiza la columna `estado` de log_picking.
 * Flujo normal: PENDIENTE → EN_PROCESO → (emitir guía) → COMPLETADA
 *
 * PATCH /logistica/ots-picking/:id_ot
 * Body: { estado }
 * Response: { message: string }
 */
export function useActualizarEstadoOT() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, ActualizarEstadoOTDto>({
    mutationFn: async ({ id_ot, estado }) => {
      if (USE_MOCK) return { message: "Estado actualizado." };
      return (await api.patch(`/logistica/ots-picking/${id_ot}`, { estado })).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["log_ots"] });
    },
  });
}

/**
 * useCrearGuia
 * Inserta en log_guia_despacho con fecha_emision = now().
 * Simultáneamente actualiza log_picking.estado → COMPLETADA.
 * (Lo que el backend haga internamente con Inventario es su responsabilidad)
 *
 * POST /logistica/guias-despacho
 * Body: CrearGuiaDto
 * Response: GuiaDespacho (el registro creado con JOINs de transportista y dirección)
 */
export function useCrearGuia(
  onSuccess?: () => void,
  onError?: (msg: string) => void,
) {
  const qc = useQueryClient();
  return useMutation<GuiaDespacho, Error, CrearGuiaDto>({
    mutationFn: async (body) => {
      if (USE_MOCK) {
        const trn = MOCK_TRANSPORTISTAS.find(t => t.id_transportista === body.id_transportista);
        const dir = MOCK_DIRECCIONES.find(d => d.id_direccion === body.id_direccion);
        return {
          ...body,
          id_guia: `GD-${String(Date.now()).slice(-4)}`,
          nombre_transportista: trn?.nombre_transp ?? "",
          patente_vehiculo: trn?.patente_vehiculo ?? "",
          direccion: dir?.direccion ?? "",
          fecha_emision: new Date().toISOString().split("T")[0],
        };
      }
      return (await api.post("/logistica/guias-despacho", body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["log_guias"] });
      qc.invalidateQueries({ queryKey: ["log_ots"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al crear guía.");
    },
  });
}

/**
 * useGuiasDespacho
 * Lee log_guia_despacho con JOINs a log_transportista y tabla direccion.
 *
 * GET /logistica/guias-despacho
 * Response: GuiaDespacho[]
 */
export function useGuiasDespacho() {
  return useQuery<GuiaDespacho[]>({
    queryKey: ["log_guias"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_GUIAS;
      return (await api.get("/logistica/guias-despacho")).data;
    },
  });
}

/**
 * useTransportistas
 * Lee log_transportista con JOIN a RRHH_empleado para nombre_empleado.
 *
 * GET /logistica/transportistas
 * Response: Transportista[]
 */
export function useTransportistas() {
  return useQuery<Transportista[]>({
    queryKey: ["log_transportistas"],
    staleTime: 1000 * 60 * 5, // los transportistas cambian poco
    queryFn: async () => {
      if (USE_MOCK) return MOCK_TRANSPORTISTAS;
      return (await api.get("/logistica/transportistas")).data;
    },
  });
}

/**
 * useDirecciones
 * Lee la tabla direccion completa.
 * Usado para el select de dirección al emitir una guía.
 *
 * GET /logistica/direcciones
 * Response: Direccion[]
 */
export function useDirecciones() {
  return useQuery<Direccion[]>({
    queryKey: ["log_direcciones"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (USE_MOCK) return MOCK_DIRECCIONES;
      return (await api.get("/logistica/direcciones")).data;
    },
  });
}

/**
 * useOperadores
 * Devuelve los empleados con rol Operador de Bodega o Jefe de Logística.
 * Usado para el select de asignación al crear OTs y registrar recepciones.
 *
 * GET /logistica/empleados-operadores
 * Response: Operador[]
 * (El backend filtra RRHH_empleado por id_rol correspondiente a esos roles)
 */
export function useOperadores() {
  return useQuery<Operador[]>({
    queryKey: ["log_operadores"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (USE_MOCK) return MOCK_OPERADORES;
      return (await api.get("/logistica/empleados-operadores")).data;
    },
  });
}

// ─── INVENTARIO ───────────────────────────────────────────────────────────────

export interface ItemInventario {
  id_producto: string;   
  nombre: string;
  stock_actual: number;
  unidad: string;        
}

const MOCK_INVENTARIO: ItemInventario[] = [
  { id_producto: "860f8184-7839-4df3-92d1-ab1960449030", nombre: "Notebook Lenovo",    stock_actual: 15, unidad: "un"  },
  { id_producto: "9a2b3c4d-1234-5678-abcd-ef0123456789", nombre: "Mouse inalámbrico",  stock_actual: 42, unidad: "un"  },
  { id_producto: "aabbccdd-eeff-1122-3344-556677889900", nombre: "Teclado mecánico",   stock_actual: 8,  unidad: "un"  },
];

/**
 * useInventario
 * Consulta el stock actual de productos.
 * El backend obtiene estos datos del módulo de Inventario internamente —
 * el frontend solo llama a su propio endpoint.
 *
 * GET /logistica/inventario
 * Response: ItemInventario[
 */
export function useInventario() {
  return useQuery<ItemInventario[]>({
    queryKey: ["log_inventario"],
    refetchInterval: USE_MOCK ? false : 60_000, // refresco cada minuto en real
    queryFn: async () => {
      if (USE_MOCK) return MOCK_INVENTARIO;
      return (await api.get("/logistica/inventario")).data;
    },
  });
}