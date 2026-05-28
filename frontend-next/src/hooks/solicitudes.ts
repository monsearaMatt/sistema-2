import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

interface CrearSolicitudPayload {
  id_empleado: number;
  tipo_solicitud: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface ActualizarSolicitudPayload {
  estado: string;
}

export function useSolicitudes() {
  return useQuery({
    queryKey: ['solicitudes'],
    queryFn: async () => {
      const { data } = await api.get('/rrhh/solicitudes');
      return data;
    },
  });
}

export function useCrearSolicitud() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CrearSolicitudPayload) => {
      const { data } = await api.post('/rrhh/solicitudes', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['solicitudes'] });
    },
  });
}

export function useActualizarSolicitud() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number } & ActualizarSolicitudPayload) => {
      const { data } = await api.patch(`/rrhh/solicitudes/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['solicitudes'] });
    },
  });
}
