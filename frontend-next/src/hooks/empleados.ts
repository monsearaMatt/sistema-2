import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

interface CrearEmpleadoPayload {
  rut: string;
  nombre: string;
  id_rol: number;
  correo?: string;
  telefono?: string;
}

interface ActualizarEmpleadoPayload {
  nombre?: string;
  id_rol?: number;
  correo?: string;
  telefono?: string;
  estado?: string;
}

export function useEmpleados() {
  return useQuery({
    queryKey: ['empleados'],
    queryFn: async () => {
      const { data } = await api.get('/rrhh/empleados');
      return data;
    },
  });
}

export function useCrearEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearEmpleadoPayload) => {
      const { data } = await api.post('/rrhh/empleados', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empleados'] });
    },
  });
}

export function useActualizarEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number } & ActualizarEmpleadoPayload) => {
      const { data } = await api.patch(`/rrhh/empleados/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empleados'] });
    },
  });
}

export function useDesactivarEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/rrhh/empleados/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empleados'] });
    },
  });
}
