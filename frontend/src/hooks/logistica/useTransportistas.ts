import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Transportista } from "@/types/logistica";

export function useTransportistas() {
  return useQuery<Transportista[]>({
    queryKey: ["transportistas"],
    queryFn: async () => {
      const res = await api.get("/logistica/transportistas");
      return res.data;
    },
  });
}