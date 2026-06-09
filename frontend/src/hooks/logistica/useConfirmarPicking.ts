import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { GuiaDespacho, ConfirmarPickingDto } from "@/types/logistica";

export function useConfirmarPicking(onSuccess?: () => void, onError?: (msg: string) => void) {
  const qc = useQueryClient();
  return useMutation<GuiaDespacho, Error, ConfirmarPickingDto>({
    mutationFn: async ({ id_ot, ...body }) => {
      const res = await api.post(`/logistica/ots-picking/${id_ot}/confirmar`, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ots_picking"] });
      qc.invalidateQueries({ queryKey: ["guias_despacho"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al confirmar picking.");
    },
  });
}