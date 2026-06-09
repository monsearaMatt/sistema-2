import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export function useDesactivarEmpleado(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id_empleado) => {
      await api.patch(`/rrhh/empleados/${id_empleado}/desactivar`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      onSuccess?.();
    },
  });
}