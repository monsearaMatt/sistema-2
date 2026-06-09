import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface CrearTransportistaPayload {
  nombre_transp: string;
  patente_vehiculo: string;
  id_empleado: number;
}

export interface CrearDireccionPayload {
  direccion: string;
  id_cliente: number;
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

export function useTransportistas() {
  return useQuery({
    queryKey: ['logistica', 'transportistas'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/transportistas');
      return data;
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

export function useDirecciones() {
  return useQuery({
    queryKey: ['logistica', 'direcciones'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/direcciones');
      return data;
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

export function usePickings() {
  return useQuery({
    queryKey: ['logistica', 'pickings'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/pickings');
      return data;
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

export function useGuias() {
  return useQuery({
    queryKey: ['logistica', 'guias'],
    queryFn: async () => {
      const { data } = await api.get('/logistica/guias');
      return data;
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