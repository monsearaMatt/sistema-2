"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface AuthGuardResult {
  listo: boolean;
  tipoUser: string | null;
}

export function useAuthGuard(rolesPermitidos: string[]): AuthGuardResult {
  const { token, tipoUser, loading } = useAuth(); // ← tipoUser, igual que en TipoAutenticacion
  const router = useRouter();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    // Esperar a que el contexto termine de leer las cookies
    if (loading) return;

    // Sin token → login
    if (!token) {
      router.push("/login");
      return;
    }

    // Rol no permitido → redirigir al módulo correcto
    if (tipoUser && !rolesPermitidos.includes(tipoUser)) {
      const ROLES_LOG = ["Jefe de Logística", "Operador de Bodega", "Admin Sistema"];
      router.push(ROLES_LOG.includes(tipoUser) ? "/Logistica" : "/RRHH");
      return;
    }

    if (token && tipoUser) setListo(true);
  }, [token, tipoUser, loading, router]);

  return { listo, tipoUser: tipoUser ?? null };
}