import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { CrearEmpleadoDto, Empleado } from "@/types/rrhh";

export function useCrearEmpleado(onSuccess?: () => void, onError?: (msg: string) => void) {
  const qc = useQueryClient();
  return useMutation<Empleado, Error, CrearEmpleadoDto>({
    mutationFn: async (data) => {
      const res = await api.post("/rrhh/empleados", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al crear empleado.");
    },
  });
}