import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { OTPicking, CrearOTDto } from "@/types/logistica";

export function useCrearOT(onSuccess?: () => void, onError?: (msg: string) => void) {
  const qc = useQueryClient();
  return useMutation<OTPicking, Error, CrearOTDto>({
    mutationFn: async (data) => {
      const res = await api.post("/logistica/ots-picking", data);
      return res.data;
    },
    onSuccess: () => {
      // Invalida OTs (nueva apareció) y OVs (estado cambió a DESPACHADA en backend)
      qc.invalidateQueries({ queryKey: ["ots_picking"] });
      qc.invalidateQueries({ queryKey: ["ordenes_venta"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al crear OT.");
    },
  });
}