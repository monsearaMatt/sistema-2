"use client";

/**
 * RRHHPage.tsx — Módulo de Recursos Humanos
 *
 * Este archivo contiene SOLO lógica de UI.
 * Toda la capa de datos (tipos, mocks, hooks, llamadas API) vive en:
 *   @/hooks/rrhh/rrhhHooks
 *
 * Para alternar entre mock y backend real:
 *   → editar USE_MOCK en rrhhHooks.ts
 */

import { useState, useEffect } from "react";
import {
  useRoles,
  useEmpleados,
  useCrearEmpleado,
  useEditarEmpleado,
  useDesactivarEmpleado,
  useSolicitudes,
  useResponderSolicitud,
  type Rol,
  type Empleado,
  type Solicitud,
} from "../../hooks/rrhh/rrhhhooks";
import {
  Users, UserPlus, Calendar, Shield, Search, Check, X,
  Eye, Edit, UserMinus, Mail, Phone, BadgeCheck,
  AlertCircle, MoreHorizontal, CalendarDays, CheckCircle2, Filter,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Input }   from "@/components/ui/input";
import { Badge }   from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { LogOut } from "lucide-react"; 

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const badgeEstado = (e: Empleado["estado"]) =>
  e === "ACTIVO"
    ? <Badge className="bg-green-500/15 text-green-500 border-green-500/20">Activo</Badge>
    : <Badge className="bg-red-500/15 text-red-500 border-red-500/20">Inactivo</Badge>;

const badgeSolicitud = (e: Solicitud["estado"]) => {
  const m: Record<Solicitud["estado"], string> = {
    PENDIENTE: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
    APROBADA:  "bg-green-500/15 text-green-500 border-green-500/20",
    RECHAZADA: "bg-red-500/15 text-red-500 border-red-500/20",
  };
  const l: Record<Solicitud["estado"], string> = {
    PENDIENTE: "Pendiente", APROBADA: "Aprobada", RECHAZADA: "Rechazada",
  };
  return <Badge className={m[e]}>{l[e]}</Badge>;
};

const badgeRol = (name_rol: string) => {
  const c: Record<string, string> = {
    "Admin Sistema":      "bg-purple-500/15 text-purple-400 border-purple-500/20",
    "Admin RRHH":         "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Jefe de Logística":  "bg-primary/15 text-primary border-primary/20",
    "Operador de Bodega": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    "Empleado":           "bg-secondary text-muted-foreground border-border",
  };
  return (
    <Badge className={`${c[name_rol] ?? "bg-secondary text-muted-foreground"} font-medium`}>
      {name_rol}
    </Badge>
  );
};

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── MODAL: Alta de Empleado (F-RRHH-01) ──────────────────────────────────────

function ModalAltaEmpleado({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: roles = [] } = useRoles();
  const crear = useCrearEmpleado(() => onClose());

  const [form, setForm] = useState({ rut: "", nombre: "", correo: "", telefono: "", id_rol: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setForm({ rut: "", nombre: "", correo: "", telefono: "", id_rol: 0 });
      setErrors({});
    }
  }, [open]);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!/^\d{7,8}-[\dkK]$/.test(form.rut.trim())) e.rut    = "Formato inválido (ej: 12345678-9)";
    if (!form.nombre.trim())                         e.nombre = "Requerido";
    if (!form.correo.includes("@"))                  e.correo = "Email inválido";
    if (!form.id_rol)                                e.id_rol = "Requerido";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const field = (key: "rut" | "nombre" | "correo" | "telefono", label: string, type = "text", ph = "") => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type={type} placeholder={ph} value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={errors[key] ? "border-red-500/50" : ""}
      />
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="w-5 h-5 text-primary" />Alta de Empleado
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {field("nombre",   "Nombre completo",    "text",  "Juan Pérez González")}
          {field("rut",      "RUT",                "text",  "12345678-9")}
          {field("correo",   "Correo corporativo", "email", "j.perez@empresa.cl")}
          {field("telefono", "Teléfono",           "text",  "+56 9 1234 5678")}
          <div className="space-y-1.5 col-span-2">
            <label className="text-sm font-medium text-foreground">Rol en el Sistema</label>
            <Select
              value={form.id_rol ? String(form.id_rol) : ""}
              onValueChange={v => setForm(p => ({ ...p, id_rol: Number(v) }))}
            >
              <SelectTrigger className={errors.id_rol ? "border-red-500/50" : ""}>
                <SelectValue placeholder="Seleccionar rol..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.id_rol} value={String(r.id_rol)}>{r.name_rol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_rol && <p className="text-xs text-red-500">{errors.id_rol}</p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Se creará un usuario con RUT como nombre de usuario y contraseña temporal.
        </p>

        {crear.isError && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-sm text-red-500">Error al crear el empleado. Intenta nuevamente.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => { if (validar()) crear.mutate(form); }}
            disabled={crear.isPending}
          >
            {crear.isPending
              ? "Registrando..."
              : <><CheckCircle2 className="w-4 h-4 mr-2" />Registrar Empleado</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── MODAL: Detalle y Edición de Empleado (F-RRHH-02) ─────────────────────────

function ModalDetalleEmpleado({
  empleado, open, onClose,
}: { empleado: Empleado | null; open: boolean; onClose: () => void }) {
  const { data: roles = [] } = useRoles();
  const editar     = useEditarEmpleado(() => setEditMode(false));
  const desactivar = useDesactivarEmpleado(() => { setConfirmDesact(false); onClose(); });

  const [editMode, setEditMode]           = useState(false);
  const [form, setForm]                   = useState<Empleado | null>(null);
  const [confirmDesact, setConfirmDesact] = useState(false);

  useEffect(() => {
    if (empleado && open) {
      setForm({ ...empleado });
      setEditMode(false);
      setConfirmDesact(false);
    }
  }, [empleado, open]);

  if (!empleado || !form) return null;

  const data = editMode ? form : empleado;

  return (
    <>
      <Dialog open={open} onOpenChange={o => { if (!o) { setEditMode(false); onClose(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              {editMode
                ? <><Edit className="w-5 h-5 text-primary" />Editar Empleado</>
                : <><Eye className="w-5 h-5 text-primary" />Detalle de Empleado</>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {empleado.nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{empleado.nombre}</p>
                <p className="text-sm text-muted-foreground">{empleado.id_empleado} · {empleado.rut}</p>
                <div className="flex gap-2 mt-1">
                  {badgeEstado(empleado.estado)}
                  {badgeRol(empleado.name_rol)}
                </div>
              </div>
            </div>

            {/* Campos */}
            <div className="space-y-3">
              {([
                { label: "Nombre completo", key: "nombre"   as const, icon: Users },
                { label: "Correo",          key: "correo"   as const, icon: Mail  },
                { label: "Teléfono",        key: "telefono" as const, icon: Phone },
              ]).map(({ label, key, icon: Icon }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {editMode
                      ? <Input
                          value={form[key]}
                          onChange={e => setForm(p => p ? { ...p, [key]: e.target.value } : p)}
                          className="h-7 text-sm mt-0.5"
                        />
                      : <p className="font-medium text-foreground text-sm truncate">{data[key]}</p>}
                  </div>
                </div>
              ))}

              {editMode && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Rol en el Sistema</label>
                  <Select
                    value={String(form.id_rol)}
                    onValueChange={v => setForm(p => p
                      ? { ...p, id_rol: Number(v), name_rol: roles.find(r => r.id_rol === Number(v))?.name_rol ?? p.name_rol }
                      : p
                    )}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.map(r => (
                        <SelectItem key={r.id_rol} value={String(r.id_rol)}>{r.name_rol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {editar.isError && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
                <p className="text-xs text-red-500">Error al guardar cambios.</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 flex-wrap">
            {!editMode ? (
              <>
                {empleado.estado === "ACTIVO" && (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDesact(true)}>
                    <UserMinus className="w-4 h-4 mr-1" />Desactivar
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="w-4 h-4 mr-1" />Editar
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>Cerrar</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => { setForm({ ...empleado }); setEditMode(false); }}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  disabled={editar.isPending}
                  onClick={() => { if (form) editar.mutate({ id_empleado: form.id_empleado, nombre: form.nombre, correo: form.correo, telefono: form.telefono, id_rol: form.id_rol }); }}
                >
                  {editar.isPending ? "Guardando..." : <><Check className="w-4 h-4 mr-1" />Guardar</>}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar desactivación */}
      <Dialog open={confirmDesact} onOpenChange={setConfirmDesact}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="w-5 h-5 text-red-500" />Confirmar Desactivación
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Desactivar a{" "}
            <span className="font-semibold text-foreground">{empleado.nombre}</span>?
            Su acceso al sistema quedará inhabilitado.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDesact(false)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={desactivar.isPending}
              onClick={() => desactivar.mutate(empleado.id_empleado)}
            >
              {desactivar.isPending
                ? "Desactivando..."
                : <><UserMinus className="w-4 h-4 mr-1" />Desactivar</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function RRHHPage() {
  const { listo } = useAuthGuard(["Admin RRHH", "Admin Sistema", "Empleado"]);
  const { data: empleados = [], isLoading: loadEmp, isError: errEmp } = useEmpleados();
  const { data: solicitudes = [], isLoading: loadSol }                = useSolicitudes();
  const responder = useResponderSolicitud();

  const [altaOpen,   setAltaOpen]   = useState(false);
  const [detalleEmp, setDetalleEmp] = useState<Empleado | null>(null);
  const [rechazarId, setRechazarId] = useState<string | null>(null);

  // Filtros dotación
  const [searchDot,    setSearchDot]    = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterRol,    setFilterRol]    = useState("todos");
  // Filtro solicitudes
  const [filterSol, setFilterSol] = useState("todos");

  // Datos derivados
  const dotacion = empleados.filter(e => {
    const match = `${e.nombre} ${e.rut} ${e.correo}`.toLowerCase().includes(searchDot.toLowerCase());
    return match
      && (filterEstado === "todos" || e.estado === filterEstado)
      && (filterRol    === "todos" || e.name_rol === filterRol);
  });

  const solFiltradas = solicitudes.filter(s => filterSol === "todos" || s.estado === filterSol);
  const pendientes   = solicitudes.filter(s => s.estado === "PENDIENTE").length;
  const activos      = empleados.filter(e => e.estado === "ACTIVO").length;
  const rolesUnicos  = [...new Set(empleados.map(e => e.name_rol))];
  const rolesCount   = empleados.reduce((acc, e) => {
    acc[e.name_rol] = (acc[e.name_rol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ── Estados de carga / error ──────────────────────────────────────────────

  
  if (!listo) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm animate-pulse">Verificando acceso...</p>
    </div>
  );

  if (loadEmp) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground animate-pulse text-sm">Cargando módulo RRHH...</p>
    </div>
  );

  if (errEmp) return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 max-w-sm text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="text-sm text-red-500 font-medium">Error al cargar los datos de RRHH.</p>
        <p className="text-xs text-muted-foreground">Verifica que el servidor esté disponible.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recursos Humanos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de empleados, vacaciones y accesos</p>
        </div>
        <Button onClick={() => setAltaOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />Alta de Empleado
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Total Empleados"       value={empleados.length}    sub={`${activos} activos`} />
        <StatCard icon={BadgeCheck} label="Roles Configurados"   value={rolesUnicos.length}  sub="en el sistema" />
        <StatCard icon={Calendar}  label="Solicitudes Pendientes" value={pendientes}          sub="requieren revisión" color="text-yellow-500" />
        <StatCard icon={Shield}    label="Empleados Activos"      value={activos}             sub={`de ${empleados.length} totales`} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dotacion" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="dotacion"   className="gap-2"><Users    className="w-4 h-4" />Dotación</TabsTrigger>
          <TabsTrigger value="vacaciones" className="gap-2">
            <Calendar className="w-4 h-4" />Vacaciones
            {pendientes > 0 && (
              <span className="ml-1 bg-yellow-500/20 text-yellow-500 text-xs px-1.5 rounded-full">{pendientes}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2"><Shield className="w-4 h-4" />Roles y Accesos</TabsTrigger>
        </TabsList>

        {/* ── TAB: DOTACIÓN ── */}
        <TabsContent value="dotacion" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, RUT o correo..."
                className="pl-9"
                value={searchDot}
                onChange={e => setSearchDot(e.target.value)}
              />
            </div>
            <Select value={filterRol} onValueChange={setFilterRol}>
              <SelectTrigger className="w-44">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                {rolesUnicos.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ACTIVO">Activos</SelectItem>
                <SelectItem value="INACTIVO">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              {dotacion.length} resultado{dotacion.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Empleado", "Correo", "Teléfono", "Rol", "Estado", "Acciones"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dotacion.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      Sin resultados para los filtros aplicados.
                    </td>
                  </tr>
                ) : dotacion.map(emp => (
                  <tr key={emp.id_empleado} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{emp.id_empleado}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {emp.nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emp.nombre}</p>
                          <p className="text-xs text-muted-foreground font-mono">{emp.rut}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{emp.correo}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{emp.telefono}</td>
                    <td className="px-4 py-3">{badgeRol(emp.name_rol)}</td>
                    <td className="px-4 py-3">{badgeEstado(emp.estado)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetalleEmp(emp)}>
                            <Eye className="w-4 h-4 mr-2" />Ver / Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── TAB: VACACIONES ── */}
        <TabsContent value="vacaciones" className="space-y-4">
          <div className="flex gap-3 items-center">
            <Select value={filterSol} onValueChange={setFilterSol}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                <SelectItem value="APROBADA">Aprobadas</SelectItem>
                <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              {solFiltradas.length} solicitud{solFiltradas.length !== 1 ? "es" : ""}
            </span>
          </div>

          {loadSol ? (
            <p className="text-center py-12 text-muted-foreground animate-pulse text-sm">
              Cargando solicitudes...
            </p>
          ) : solFiltradas.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              No hay solicitudes en este estado.
            </div>
          ) : (
            <div className="space-y-3">
              {solFiltradas.map(sol => (
                <div key={sol.id_solicitud}
                  className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4 hover:bg-accent/20 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {sol.nombre_empleado.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{sol.nombre_empleado}</p>
                        {badgeSolicitud(sol.estado)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {sol.fecha_inicio} → {sol.fecha_fin}
                        </span>
                        <span className="font-medium text-foreground">{sol.dias} días</span>
                        <span className="font-mono">{sol.tipo_solicitud}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{sol.id_solicitud}</p>
                    </div>
                  </div>

                  {sol.estado === "PENDIENTE" && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        disabled={responder.isPending}
                        onClick={() => responder.mutate({ id_solicitud: sol.id_solicitud, estado: "APROBADA" })}
                      >
                        <Check className="w-4 h-4 mr-1" />Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                        disabled={responder.isPending}
                        onClick={() => setRechazarId(sol.id_solicitud)}
                      >
                        <X className="w-4 h-4 mr-1" />Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── TAB: ROLES Y ACCESOS ── */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Distribución por rol */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />Distribución por Rol
              </h3>
              {Object.entries(rolesCount).map(([rol, count]) => {
                const pct = Math.round((count / empleados.length) * 100);
                return (
                  <div key={rol} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      {badgeRol(rol)}
                      <span className="text-sm font-medium text-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matriz de accesos */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Matriz de Accesos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-muted-foreground uppercase">Acción</th>
                      {["Adm. Sis.", "Adm. RRHH", "J. Log.", "Op. Bod.", "Empl."].map(r => (
                        <th key={r} className="text-center px-2 py-2 text-muted-foreground uppercase">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["Alta Empleado",    true,  true,  false, false, false],
                      ["Ver Dotación",     true,  true,  false, false, false],
                      ["Editar Empleado",  true,  true,  false, false, false],
                      ["Desactivar",       true,  true,  false, false, false],
                      ["Apro. Vacaciones", true,  true,  false, false, false],
                      ["Solicitar Vac.",   true,  true,  true,  true,  true ],
                      ["Gestión Roles",    true,  false, false, false, false],
                    ] as [string, ...boolean[]][]).map(([lbl, ...perms]) => (
                      <tr key={lbl} className="border-b border-border hover:bg-accent/20">
                        <td className="px-3 py-2 font-medium text-foreground">{lbl}</td>
                        {perms.map((p, i) => (
                          <td key={i} className="text-center px-2 py-2">
                            {p
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mx-auto" />
                              : <X className="w-3.5 h-3.5 text-muted-foreground/30 mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Modals ── */}
      <ModalAltaEmpleado open={altaOpen} onClose={() => setAltaOpen(false)} />

      <ModalDetalleEmpleado
        empleado={detalleEmp}
        open={!!detalleEmp}
        onClose={() => setDetalleEmp(null)}
      />

      {/* Confirmar rechazo — sin observaciones (campo no existe en BD) */}
      <Dialog open={!!rechazarId} onOpenChange={() => setRechazarId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <X className="w-5 h-5 text-red-500" />Rechazar Solicitud
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Confirmar el rechazo de la solicitud{" "}
            <span className="font-semibold text-foreground">{rechazarId}</span>?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRechazarId(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={responder.isPending}
              onClick={() =>
                responder.mutate(
                  { id_solicitud: rechazarId!, estado: "RECHAZADA" },
                  { onSuccess: () => setRechazarId(null) },
                )
              }
            >
              {responder.isPending
                ? "Procesando..."
                : <><X className="w-4 h-4 mr-1" />Confirmar Rechazo</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}