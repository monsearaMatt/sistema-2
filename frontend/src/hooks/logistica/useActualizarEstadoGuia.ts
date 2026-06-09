import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

interface ActualizarEstadoDto {
  id_guia: string;
  estado: "EN_TRANSITO" | "ENTREGADA";
}

export function useActualizarEstadoGuia() {
  const qc = useQueryClient();
  return useMutation<void, Error, ActualizarEstadoDto>({
    mutationFn: async ({ id_guia, estado }) => {
      await api.patch(`/logistica/guias-despacho/${id_guia}/estado`, { estado });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guias_despacho"] });
      qc.invalidateQueries({ queryKey: ["ordenes_venta"] });
    },
  });
}