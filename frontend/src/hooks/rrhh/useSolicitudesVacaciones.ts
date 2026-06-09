import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { SolicitudVacaciones } from "@/types/rrhh";

export function useSolicitudesVacaciones() {
  return useQuery<SolicitudVacaciones[]>({
    queryKey: ["solicitudes_vacaciones"],
    queryFn: async () => {
      const res = await api.get("/rrhh/solicitudes-vacaciones");
      return res.data;
    },
  });
}