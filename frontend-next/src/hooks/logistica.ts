import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data : [];
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface CrearTransportistaPayload {
  nombre_transp: string;
  patente_vehiculo: string;
  id_empleado: number;
}

export interface ActualizarTransportistaPayload {
  nombre_transp?: string;
  patente_vehiculo?: string;
  id_empleado?: number;
}

export interface CrearDireccionPayload {
  direccion: string;
  id_cliente: number;
}

export interface ActualizarDireccionPayload {
  direccion?: string;
  id_cliente?: number;
}

export interface CrearPickingPayload {
  id_pedido_venta?: number;
  estado?: 'Pendiente' | 'En Proceso' | 'Completado';
}

export interface CrearGuiaPayload {
  id_ot: number;
  id_transportista: number;
  id_direccion: number;
}

export interface CrearRecepcionPayload {
  id_orden_compra: string;
  id_empleado: number;
}

// ─── TRANSPORTISTAS (CRUD) ───────────────────────────────────────────────────

export function useTransportistas() {
  return useQuery({
    queryKey: ['logistica', 'transportistas'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/transportistas');
      return asArray(data);
    },
  });
}

export function useCrearTransportista() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearTransportistaPayload) => {
      const { data } = await api.post('/logistica/transportistas', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'transportistas'] });
    },
  });
}

export function useActualizarTransportista() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ActualizarTransportistaPayload }) => {
      const { data } = await api.patch(`/logistica/transportistas/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'transportistas'] });
    },
  });
}

export function useEliminarTransportista() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/logistica/transportistas/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'transportistas'] });
    },
  });
}

// ─── DIRECCIONES (CRUD) ───────────────────────────────────────────────────────

export function useDirecciones() {
  return useQuery({
    queryKey: ['logistica', 'direcciones'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/direcciones');
      return asArray(data);
    },
  });
}

export function useCrearDireccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearDireccionPayload) => {
      const { data } = await api.post('/logistica/direcciones', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'direcciones'] });
    },
  });
}

export function useActualizarDireccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ActualizarDireccionPayload }) => {
      const { data } = await api.patch(`/logistica/direcciones/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'direcciones'] });
    },
  });
}

export function useEliminarDireccion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/logistica/direcciones/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'direcciones'] });
    },
  });
}

// ─── PICKINGS & DESPACHOS ────────────────────────────────────────────────────

export function usePickings() {
  return useQuery({
    queryKey: ['logistica', 'pickings'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/pickings');
      return asArray(data);
    },
  });
}

export function useCrearPicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearPickingPayload) => {
      const { data } = await api.post('/logistica/pickings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'pickings'] });
    },
  });
}

export function useAsignarPicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, id_empleado }: { id: number; id_empleado: number }) => {
      const { data } = await api.patch(`/logistica/pickings/${id}/assign`, { id_empleado });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'pickings'] });
    },
  });
}

export function useCompletarPicking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/logistica/pickings/${id}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'pickings'] });
    },
  });
}

export function useConfirmarDespacho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/logistica/pickings/${id}/confirm-dispatch`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'pickings'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'ventas', 'pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'maestros', 'productos'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'inventario', 'movimientos'] });
    },
  });
}

// ─── GUIAS DE DESPACHO ────────────────────────────────────────────────────────

export function useGuias() {
  return useQuery({
    queryKey: ['logistica', 'guias'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/guias');
      return asArray(data);
    },
  });
}

export function useCrearGuia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearGuiaPayload) => {
      const { data } = await api.post('/logistica/guias', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'guias'] });
    },
  });
}

// ─── AUXILIAR MAESTROS & RRHH ───────────────────────────────────────────────

export function useEmpleados() {
  return useQuery({
    queryKey: ['rrhh', 'empleados'],
    queryFn: async () => {
      const { data } = await api.get('/rrhh/empleados');
      return asArray(data);
    },
  });
}

export function useMaestroClientes() {
  return useQuery({
    queryKey: ['logistica', 'maestros', 'clientes'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/maestros/clientes');
      return asArray(data);
    },
  });
}

export function useMaestroProductos() {
  return useQuery({
    queryKey: ['logistica', 'maestros', 'productos'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/maestros/productos');
      return data as { catalogo: any[]; inventario: any[] };
    },
  });
}

export function useMaestroProveedores() {
  return useQuery({
    queryKey: ['logistica', 'maestros', 'proveedores'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/maestros/proveedores');
      return asArray(data);
    },
  });
}

// ─── INTEGRACION DE BACKENDS ──────────────────────────────────────────────────

export function useVentasPedidos() {
  return useQuery({
    queryKey: ['logistica', 'ventas', 'pedidos'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/ventas/pedidos');
      return asArray(data);
    },
  });
}

export function useComprasOrdenes() {
  return useQuery({
    queryKey: ['logistica', 'compras', 'ordenes'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/compras/ordenes');
      return asArray(data);
    },
  });
}

export function useComprasSendedOrders() {
  return useQuery({
    queryKey: ['logistica', 'compras', 'sended'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/compras/sended');
      return asArray(data);
    },
  });
}

export function useRecepciones() {
  return useQuery({
    queryKey: ['logistica', 'recepciones'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/recepciones');
      return asArray(data);
    },
  });
}

export function useCrearRecepcion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearRecepcionPayload) => {
      const { data } = await api.post('/logistica/recepciones', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'recepciones'] });
    },
  });
}

export function useConfirmarRecepcion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/logistica/recepciones/${id}/confirm-receipt`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'recepciones'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'compras', 'ordenes'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'maestros', 'productos'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'inventario', 'movimientos'] });
    },
  });
}

export function useActualizarCompraEstado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const { data } = await api.patch(`/logistica/compras/${id}`, { estado });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistica', 'compras', 'sended'] });
      queryClient.invalidateQueries({ queryKey: ['logistica', 'compras', 'ordenes'] });
    },
  });
}

export function useMovimientosInventario() {
  return useQuery({
    queryKey: ['logistica', 'inventario', 'movimientos'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/maestros/movimientos');
      return asArray(data);
    },
  });
}

// ─── KPIS ────────────────────────────────────────────────────────────────────

export function useKpiProductividad() {
  return useQuery({
    queryKey: ['logistica', 'kpis', 'productividad'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/kpis/productividad');
      return asArray(data);
    },
  });
}

export function useKpiTiempoDespacho() {
  return useQuery({
    queryKey: ['logistica', 'kpis', 'tiempo-despacho'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/kpis/tiempo-despacho');
      return data as { promedio_horas: number | null };
    },
  });
}