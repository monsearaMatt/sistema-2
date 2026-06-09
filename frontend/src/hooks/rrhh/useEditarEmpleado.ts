import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Empleado } from "@/types/rrhh";

export function useEditarEmpleado(onSuccess?: () => void, onError?: (msg: string) => void) {
  const qc = useQueryClient();
  return useMutation<Empleado, Error, Empleado>({
    mutationFn: async (empleado) => {
      const res = await api.patch(`/rrhh/empleados/${empleado.id_empleado}`, empleado);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al editar empleado.");
    },
  });
}