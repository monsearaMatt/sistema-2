import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { OTPicking } from "@/types/logistica";

export function useOTsPicking() {
  return useQuery<OTPicking[]>({
    queryKey: ["ots_picking"],
    queryFn: async () => {
      const res = await api.get("/logistica/ots-picking");
      return res.data;
    },
  });
}