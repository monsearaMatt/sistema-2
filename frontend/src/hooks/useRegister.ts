import { useMutation } from "@tanstack/react-query"
import api from "../api/axios"
import type { AxiosError } from "axios"

interface Registerdata {
    username: string,
    password: string
}

interface Registerresponse {
  message: string
}

export function useRegister(onSuccess: () => void, onFail: (error: string) => void) {
  return useMutation<Registerresponse, AxiosError, Registerdata>({
    mutationFn: async ({ username, password }) => {
      const respuesta = await api.post("/auth/register", { username, password })
      return respuesta.data
    },
    onSuccess: () => {
      onSuccess()
    },
    onError: (error) => {
      const mensaje = (error.response?.data as { message?: string })?.message || "No se pudo identificar el error."
      onFail(mensaje)
    },
  })
}