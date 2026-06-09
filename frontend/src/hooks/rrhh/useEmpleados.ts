import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Empleado } from "../types/rrhh";

export function useEmpleados() {
  return useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: async () => {
      const res = await api.get("/rrhh/empleados");
      return res.data;
    },
  });
}