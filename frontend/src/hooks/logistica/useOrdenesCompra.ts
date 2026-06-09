import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { OrdenCompra } from "@/types/logistica";

export function useOrdenesCompra() {
  return useQuery<OrdenCompra[]>({
    queryKey: ["ordenes_compra"],
    queryFn: async () => {
      const res = await api.get("/logistica/ordenes-compra");
      return res.data;
    },
  });
}