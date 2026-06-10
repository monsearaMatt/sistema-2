import { NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts (Next.js 16 Proxy)
 *
 * Protege las rutas del sistema según rol del usuario.
 * Lee las cookies "token" y "tipoUser" que setea el AuthContext tras el login.
 */

const RUTAS_PUBLICAS = ["/", "/login", "/register"];

// Roles con acceso a cada módulo
const ROLES_RRHH = ["Admin RRHH", "Admin Sistema", "Empleado"];
const ROLES_LOG  = ["Jefe de Logística", "Operador de Bodega", "Admin Sistema"];

function redirectByRole(tipo: string | undefined, request: NextRequest) {
  if (!tipo) {
    // Si hay token pero no se ha cargado el tipo, dejamos pasar al cliente para evitar loops infinitos
    return NextResponse.next();
  }
  // Roles exclusivos de Logística → van a Logística
  if (ROLES_LOG.includes(tipo) && !ROLES_RRHH.includes(tipo)) {
    return NextResponse.redirect(new URL("/Logistica", request.url));
  }
  // El resto (Admin RRHH, Empleado, Admin Sistema) → van a RRHH
  return NextResponse.redirect(new URL("/RRHH", request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const tipo  = request.cookies.get("tipoUser")?.value;

  const esPublica = RUTAS_PUBLICAS.includes(pathname);

  if (!token && !esPublica) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  if (token && esPublica && pathname !== "/") {
    return redirectByRole(tipo, request);
  }

  if (pathname.startsWith("/RRHH") && token) {
    if (tipo && !ROLES_RRHH.includes(tipo)) {
      return NextResponse.redirect(new URL("/Logistica", request.url));
    }
  }

  if (pathname.startsWith("/Logistica") && token) {
    if (tipo && !ROLES_LOG.includes(tipo)) {
      return NextResponse.redirect(new URL("/RRHH", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
