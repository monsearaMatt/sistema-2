import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { OrdenVenta } from "@/types/logistica";

export function useOrdenesVenta() {
  return useQuery<OrdenVenta[]>({
    queryKey: ["ordenes_venta"],
    queryFn: async () => {
      const res = await api.get("/logistica/ordenes-venta");
      return res.data;
    },
  });
}