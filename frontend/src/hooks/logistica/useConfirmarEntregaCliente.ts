import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

interface ConfirmarEntregaDto {
  id_guia: string;
  lineas: { codigo: string; cantidad_confirmada_cliente: number }[];
}

export function useConfirmarEntregaCliente(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<void, Error, ConfirmarEntregaDto>({
    mutationFn: async ({ id_guia, ...body }) => {
      await api.post(`/logistica/guias-despacho/${id_guia}/confirmar-entrega`, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guias_despacho"] });
      qc.invalidateQueries({ queryKey: ["ordenes_venta"] });
      onSuccess?.();
    },
  });
}