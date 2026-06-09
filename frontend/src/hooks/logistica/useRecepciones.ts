import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { RecepcionMercaderia } from "@/types/logistica";

export function useRecepciones() {
  return useQuery<RecepcionMercaderia[]>({
    queryKey: ["recepciones"],
    queryFn: async () => {
      const res = await api.get("/logistica/recepciones");
      return res.data;
    },
  });
}