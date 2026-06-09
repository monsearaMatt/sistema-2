import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { GuiaDespacho } from "@/types/logistica";

export function useGuiasDespacho() {
  return useQuery<GuiaDespacho[]>({
    queryKey: ["guias_despacho"],
    queryFn: async () => {
      const res = await api.get("/logistica/guias-despacho");
      return res.data;
    },
  });
}