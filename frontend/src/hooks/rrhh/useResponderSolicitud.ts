import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

interface ResponderDto {
  id_solicitud: string;
  estado: "APROBADA" | "RECHAZADA";
  observaciones?: string;
}

export function useResponderSolicitud(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<void, Error, ResponderDto>({
    mutationFn: async ({ id_solicitud, estado, observaciones }) => {
      await api.patch(`/rrhh/solicitudes-vacaciones/${id_solicitud}`, { estado, observaciones });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["solicitudes_vacaciones"] });
      onSuccess?.();
    },
  });
}