import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Demo Sistema ERP</h1>
        <p className="text-primary font-semibold mt-1 text-sm tracking-wide uppercase">SI2</p>
      </div>


      <div className="w-full max-w-md rounded-xl border border-border bg-card overflow-hidden">

        <div className="h-1 w-full bg-primary" />

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-2">Bienvenido al sistema</h2>
            <p className="text-sm text-muted-foreground">
              Por favor accede o crea una cuenta para entrar al sistema.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Crear Cuenta</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/RRHH">Módulo RRHH</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/Logistica">Módulo Logística</Link>
            </Button>
          </div>
        </div>
      </div>


      <p className="mt-8 text-xs text-muted-foreground">
        Demo Sistema ERP SI2 © {new Date().getFullYear()}
      </p>

    </div>
  );
}