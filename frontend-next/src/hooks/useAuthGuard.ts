"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface AuthGuardResult {
  listo: boolean;
  tipoUser: string | null;
}

export function useAuthGuard(rolesPermitidos: string[]): AuthGuardResult {
  const { token, tipoUser, loading } = useAuth();
  const router = useRouter();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.push("/login");
      return;
    }

    if (token && !tipoUser) {
      router.push("/login");
      return;
    }

    if (tipoUser && !rolesPermitidos.includes(tipoUser)) {
      const ROLES_LOG = ["Jefe de Logística", "Operador de Bodega", "Admin Sistema"];
      router.push(ROLES_LOG.includes(tipoUser) ? "/Logistica" : "/RRHH");
      return;
    }

    if (token && tipoUser) setListo(true);

  }, [token, tipoUser, loading, router]);

  return { listo, tipoUser: tipoUser ?? null };
}
