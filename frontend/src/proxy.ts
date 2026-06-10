import { NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts — Protección de rutas y redirección por rol
 *
 * Lee las cookies "token" y "tipoUser" que setea el AuthContext tras el login.
 *
 * Lógica:
 *   - Sin token → redirige a /login
 *   - Con token en ruta pública (/, /login, /register) → redirige al módulo
 *   - /RRHH sin rol permitido → redirige a /Logistica
 *   - /Logistica sin rol permitido → redirige a /RRHH
 */

const RUTAS_PUBLICAS = ["/", "/login", "/register"];

const ROLES_RRHH = ["Admin RRHH", "Admin Sistema", "Empleado"];
const ROLES_LOG  = ["Jefe de Logística", "Operador de Bodega", "Admin Sistema"];

function redirectByRole(tipo: string | undefined, request: NextRequest): NextResponse {
  if (!tipo) return NextResponse.redirect(new URL("/login", request.url));
  if (ROLES_LOG.includes(tipo) && !ROLES_RRHH.includes(tipo)) {
    return NextResponse.redirect(new URL("/Logistica", request.url));
  }
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

  if (token && esPublica) {
    return redirectByRole(tipo, request);
  }

  if (pathname.startsWith("/RRHH") && token) {
    if (!ROLES_RRHH.includes(tipo ?? "")) {
      return NextResponse.redirect(new URL("/Logistica", request.url));
    }
  }

  if (pathname.startsWith("/Logistica") && token) {
    if (!ROLES_LOG.includes(tipo ?? "")) {
      return NextResponse.redirect(new URL("/RRHH", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};