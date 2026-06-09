import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { RecepcionMercaderia, RegistrarRecepcionDto } from "@/types/logistica";

export function useRegistrarRecepcion(onSuccess?: () => void, onError?: (msg: string) => void) {
  const qc = useQueryClient();
  return useMutation<RecepcionMercaderia, Error, RegistrarRecepcionDto>({
    mutationFn: async (data) => {
      const res = await api.post("/logistica/recepciones", data);
      return res.data;
    },
    onSuccess: () => {
      // Backend actualiza estado de OC e impacta inventario automáticamente
      qc.invalidateQueries({ queryKey: ["recepciones"] });
      qc.invalidateQueries({ queryKey: ["ordenes_compra"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al registrar recepción.");
    },
  });
}