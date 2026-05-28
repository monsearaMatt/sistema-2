"use client";

import { useState, useEffect } from "react";
import {
  Users, UserPlus, Calendar, Shield, Search, Filter,
  ChevronDown, Check, X, Clock, Eye, Edit, UserMinus,
  Building2, Mail, Phone, BadgeCheck, AlertCircle, MoreHorizontal,
  ArrowUpDown, Briefcase, CalendarDays, CheckCircle2
} from "lucide-react";
import { useEmpleados, useCrearEmpleado, useActualizarEmpleado, useDesactivarEmpleado } from "../../hooks/empleados";
import { useSolicitudes, useCrearSolicitud, useActualizarSolicitud } from "../../hooks/solicitudes";
import { useRoles } from "../../hooks/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

type Estado = "ACTIVO" | "INACTIVO";
type TipoContrato = "Indefinido" | "Plazo Fijo" | "Honorarios";
type Departamento = "Ventas" | "Compras" | "Logística" | "RRHH" | "Inventario" | "TI";
type RolSistema = "Admin RRHH" | "Empleado" | "Jefe de Logística" | "Operador de Bodega" | "Admin Sistema";
type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";

interface Empleado {
  id_empleado: string;
  rut: string;
  nombre: string;
  apellidos: string;
  cargo: string;
  departamento: Departamento;
  fecha_ingreso: string;
  tipo_contrato: TipoContrato;
  correo: string;
  telefono: string;
  estado: Estado;
  rol_sistema: RolSistema;
  fecha_nacimiento: string;
}

interface SolicitudVacaciones {
  id_solicitud: string;
  id_empleado: string;
  nombre_empleado: string;
  departamento: Departamento;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estado: EstadoSolicitud;
  observaciones: string;
  fecha_solicitud: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapEmpleado(e: any): Empleado {
  const nombres = (e.nombre ?? '').split(' ');
  return {
    id_empleado: String(e.id_empleado),
    rut: e.rut ?? '',
    nombre: nombres[0] ?? '',
    apellidos: nombres.slice(1).join(' '),
    cargo: '',
    departamento: '' as Departamento,
    fecha_ingreso: '',
    tipo_contrato: '' as TipoContrato,
    correo: e.correo ?? '',
    telefono: e.telefono ?? '',
    estado: e.estado === 'Inactivo' ? 'INACTIVO' : 'ACTIVO',
    rol_sistema: (e.RRHH_rol?.name_rol as RolSistema) ?? 'Empleado',
    fecha_nacimiento: '',
  };
}

function mapSolicitud(s: any): SolicitudVacaciones {
  const inicio = s.fecha_inicio ? new Date(s.fecha_inicio) : new Date();
  const fin = s.fecha_fin ? new Date(s.fecha_fin) : new Date();
  return {
    id_solicitud: String(s.id_solicitud),
    id_empleado: String(s.id_empleado),
    nombre_empleado: s.RRHH_empleado?.nombre ?? '',
    departamento: '' as Departamento,
    fecha_inicio: inicio.toISOString().split('T')[0],
    fecha_fin: fin.toISOString().split('T')[0],
    dias: Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    estado: s.estado as EstadoSolicitud,
    observaciones: '',
    fecha_solicitud: '',
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const estadoBadge = (estado: Estado) =>
  estado === "ACTIVO"
    ? <Badge className="bg-green-500/15 text-green-500 border-green-500/20 hover:bg-green-500/20">Activo</Badge>
    : <Badge className="bg-red-500/15 text-red-500 border-red-500/20 hover:bg-red-500/20">Inactivo</Badge>;

const solicitudBadge = (estado: EstadoSolicitud) => {
  if (estado === "PENDIENTE") return <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/20">Pendiente</Badge>;
  if (estado === "APROBADA") return <Badge className="bg-green-500/15 text-green-500 border-green-500/20">Aprobada</Badge>;
  return <Badge className="bg-red-500/15 text-red-500 border-red-500/20">Rechazada</Badge>;
};

const rolBadge = (rol: RolSistema) => {
  const colors: Record<RolSistema, string> = {
    "Admin Sistema": "bg-purple-500/15 text-purple-400 border-purple-500/20",
    "Admin RRHH": "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Jefe de Logística": "bg-primary/15 text-primary border-primary/20",
    "Operador de Bodega": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    "Empleado": "bg-secondary text-muted-foreground border-border",
  };
  return <Badge className={`${colors[rol]} font-medium`}>{rol}</Badge>;
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg bg-primary/10 border border-primary/20`}>
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

// ─── Alta Empleado Modal ──────────────────────────────────────────────────────

function AltaEmpleadoModal({ open, onClose, onCrear, roles }: {
  open: boolean; onClose: () => void; onCrear: (emp: Empleado) => void;
  roles: { id_rol: number; name_rol: string }[];
}) {
  const [form, setForm] = useState({
    nombre: "", apellidos: "", rut: "", fecha_nacimiento: "",
    cargo: "", departamento: "" as Departamento | "",
    tipo_contrato: "" as TipoContrato | "",
    correo: "", telefono: "", rol_sistema: "" as RolSistema | "",
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validarRut = (rut: string) => /^\d{7,8}-[\dkK]$/.test(rut.trim());

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellidos.trim()) e.apellidos = "Requerido";
    if (!validarRut(form.rut)) e.rut = "Formato inválido (ej: 12345678-9)";
    if (!form.correo.includes("@")) e.correo = "Email inválido";
    if (!form.departamento) e.departamento = "Requerido";
    if (!form.cargo.trim()) e.cargo = "Requerido";
    if (!form.tipo_contrato) e.tipo_contrato = "Requerido";
    if (!form.rol_sistema) e.rol_sistema = "Requerido";
    if (new Date(form.fecha_ingreso) > new Date()) e.fecha_ingreso = "No puede ser fecha futura";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const nuevo: Empleado = {
      id_empleado: `EMP-${String(Math.floor(Math.random() * 900) + 100)}`,
      rut: form.rut,
      nombre: form.nombre,
      apellidos: form.apellidos,
      cargo: form.cargo,
      departamento: form.departamento as Departamento,
      fecha_ingreso: form.fecha_ingreso,
      tipo_contrato: form.tipo_contrato as TipoContrato,
      correo: form.correo,
      telefono: form.telefono,
      estado: "ACTIVO",
      rol_sistema: form.rol_sistema as RolSistema,
      fecha_nacimiento: form.fecha_nacimiento,
    };
    onCrear(nuevo);
    onClose();
    setForm({ nombre: "", apellidos: "", rut: "", fecha_nacimiento: "", cargo: "", departamento: "", tipo_contrato: "", correo: "", telefono: "", rol_sistema: "", fecha_ingreso: new Date().toISOString().split("T")[0] });
    setErrors({});
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className={errors[key] ? "border-red-500/50" : ""}
      />
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  const selectField = (key: keyof typeof form, label: string, options: string[]) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={form[key]} onValueChange={v => setForm(p => ({ ...p, [key]: v }))}>
        <SelectTrigger className={errors[key] ? "border-red-500/50" : ""}>
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="w-5 h-5 text-primary" /> Alta de Empleado
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {field("nombre", "Nombre", "text", "Juan")}
          {field("apellidos", "Apellidos", "text", "Pérez González")}
          {field("rut", "RUT", "text", "12345678-9")}
          {field("fecha_nacimiento", "Fecha de Nacimiento", "date")}
          {field("correo", "Correo Corporativo", "email", "j.perez@empresa.cl")}
          {field("telefono", "Teléfono", "text", "+56 9 1234 5678")}
          {selectField("departamento", "Departamento", ["Ventas", "Compras", "Logística", "RRHH", "Inventario", "TI"])}
          {field("cargo", "Cargo", "text", "Ej: Vendedor Senior")}
          {selectField("tipo_contrato", "Tipo de Contrato", ["Indefinido", "Plazo Fijo", "Honorarios"])}
          {selectField("rol_sistema", "Rol en el Sistema", roles.map(r => r.name_rol))}
          {field("fecha_ingreso", "Fecha de Ingreso", "date")}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}><CheckCircle2 className="w-4 h-4 mr-2" />Registrar Empleado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Detalle Empleado Modal ───────────────────────────────────────────────────

function DetalleEmpleadoModal({ empleado, open, onClose, onDesactivar, onEditar }: {
  empleado: Empleado | null; open: boolean; onClose: () => void;
  onDesactivar: (id: string) => void; onEditar: (emp: Empleado) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Empleado | null>(null);


  useEffect(() => {
    if (empleado) {
      setForm({ ...empleado });
      setEditMode(false);
    }
  }, [empleado, open]);

  if (!empleado) return null;

  const startEdit = () => setEditMode(true);
  const cancelEdit = () => { setForm({ ...empleado }); setEditMode(false); };
  const saveEdit = () => {
    if (form) {
      onEditar(form);
      setEditMode(false);
    }
  };

  const data = editMode && form ? form : empleado;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { setEditMode(false); onClose(); } }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Eye className="w-5 h-5 text-primary" />
            {editMode ? "Editar Empleado" : "Detalle de Empleado"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
              {empleado.nombre[0]}{empleado.apellidos[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{empleado.nombre} {empleado.apellidos}</p>
              <p className="text-sm text-muted-foreground">{empleado.id_empleado} · {empleado.rut}</p>
              <div className="flex gap-2 mt-1">{estadoBadge(empleado.estado)}{rolBadge(empleado.rol_sistema)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Cargo", icon: Briefcase, val: editMode ? <Input value={form!.cargo} onChange={e => setForm(p => p ? { ...p, cargo: e.target.value } : p)} className="h-7 text-xs" /> : data.cargo },
              { label: "Departamento", icon: Building2, val: editMode ? <Select value={form!.departamento} onValueChange={v => setForm(p => p ? { ...p, departamento: v as Departamento } : p)}><SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger><SelectContent>{["Ventas","Compras","Logística","RRHH","Inventario","TI"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select> : data.departamento },
              { label: "Correo", icon: Mail, val: data.correo },
              { label: "Teléfono", icon: Phone, val: data.telefono },
              { label: "Contrato", icon: BadgeCheck, val: data.tipo_contrato },
              { label: "Ingreso", icon: CalendarDays, val: data.fecha_ingreso },
            ].map(({ label, icon: Icon, val }) => (
              <div key={label} className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-border">
                <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <div className="font-medium text-foreground">{val}</div>
                </div>
              </div>
            ))}
          </div>

          {editMode && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rol en el Sistema</label>
              <Select value={form!.rol_sistema} onValueChange={v => setForm(p => p ? { ...p, rol_sistema: v as RolSistema } : p)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Admin RRHH","Empleado","Jefe de Logística","Operador de Bodega","Admin Sistema"] as RolSistema[]).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {!editMode ? (
            <>
              {empleado.estado === "ACTIVO" && (
                <Button variant="destructive" size="sm" onClick={() => { onDesactivar(empleado.id_empleado); onClose(); }}>
                  <UserMinus className="w-4 h-4 mr-1" /> Desactivar
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={startEdit}><Edit className="w-4 h-4 mr-1" /> Editar</Button>
              <Button variant="outline" size="sm" onClick={onClose}>Cerrar</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={cancelEdit}>Cancelar</Button>
              <Button size="sm" onClick={saveEdit}><Check className="w-4 h-4 mr-1" /> Guardar Cambios</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RRHH() {
  const { data: empleadosApi, isLoading: loadingEmp } = useEmpleados();
  const { data: solicitudesApi, isLoading: loadingSol } = useSolicitudes();
  const { data: roles } = useRoles();
  const crearEmpleado = useCrearEmpleado();
  const actualizarEmpleado = useActualizarEmpleado();
  const desactivarEmpleado = useDesactivarEmpleado();
  const actualizarSolicitud = useActualizarSolicitud();

  const empleados: Empleado[] = (empleadosApi ?? []).map(mapEmpleado);
  const solicitudes: SolicitudVacaciones[] = (solicitudesApi ?? []).map(mapSolicitud);

  const roleOptions: { id_rol: number; name_rol: string }[] = roles ?? [];

  const [searchDot, setSearchDot] = useState("");
  const [filterDepto, setFilterDepto] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");


  const [filterEstadoSol, setFilterEstadoSol] = useState("todos");


  const [altaOpen, setAltaOpen] = useState(false);
  const [detalleEmp, setDetalleEmp] = useState<Empleado | null>(null);
  const [confirmDesactivar, setConfirmDesactivar] = useState<string | null>(null);
  const [rechazarId, setRechazarId] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");



  const handleCrearEmpleado = (emp: Empleado) => {
    const payload = {
      rut: emp.rut,
      nombre: `${emp.nombre} ${emp.apellidos}`.trim(),
      id_rol: roleOptions.find(r => r.name_rol === emp.rol_sistema)?.id_rol ?? 1,
      correo: emp.correo || undefined,
      telefono: emp.telefono || undefined,
    };
    crearEmpleado.mutate(payload);
  };

  const handleDesactivar = (id: string) => {
    desactivarEmpleado.mutate(Number(id));
  };

  const handleEditarEmpleado = (emp: Empleado) => {
    const id_rol = roleOptions.find(r => r.name_rol === emp.rol_sistema)?.id_rol;
    const payload: any = {};
    if (emp.nombre || emp.apellidos) payload.nombre = `${emp.nombre} ${emp.apellidos}`.trim();
    if (emp.correo) payload.correo = emp.correo;
    if (emp.telefono) payload.telefono = emp.telefono;
    if (id_rol) payload.id_rol = id_rol;
    actualizarEmpleado.mutate({ id: Number(emp.id_empleado), ...payload });
  };

  const handleAprobarSolicitud = (id: string) => {
    actualizarSolicitud.mutate({ id: Number(id), estado: 'Aprobada' });
  };

  const handleRechazarSolicitud = () => {
    if (!rechazarId) return;
    actualizarSolicitud.mutate({ id: Number(rechazarId), estado: 'Rechazada' });
    setRechazarId(null);
    setMotivoRechazo("");
  };



  const dotacionFiltrada = empleados.filter(e => {
    const matchSearch = `${e.nombre} ${e.apellidos} ${e.rut} ${e.cargo}`.toLowerCase().includes(searchDot.toLowerCase());
    const matchDepto = filterDepto === "todos" || e.departamento === filterDepto;
    const matchEstado = filterEstado === "todos" || e.estado === filterEstado;
    return matchSearch && matchDepto && matchEstado;
  });

  const solicitudesFiltradas = solicitudes.filter(s =>
    filterEstadoSol === "todos" || s.estado === filterEstadoSol
  );

  const activos = empleados.filter(e => e.estado === "ACTIVO").length;
  const pendientes = solicitudes.filter(s => s.estado === "PENDIENTE").length;
  const deptos = [...new Set(empleados.map(e => e.departamento))].length;


  const rolesCount = empleados.reduce((acc, e) => {
    acc[e.rol_sistema] = (acc[e.rol_sistema] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptosCount = empleados.reduce((acc, e) => {
    acc[e.departamento] = (acc[e.departamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">


      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recursos Humanos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de empleados, vacaciones y accesos del sistema</p>
        </div>
        <Button onClick={() => setAltaOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Alta de Empleado
        </Button>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Empleados" value={empleados.length} sub={`${activos} activos`} />
        <StatCard icon={Building2} label="Departamentos" value={deptos} sub="con dotación activa" />
        <StatCard icon={Calendar} label="Solicitudes Pendientes" value={pendientes} sub="requieren revisión" color="text-yellow-500" />
        <StatCard icon={Shield} label="Perfiles de Acceso" value={Object.keys(rolesCount).length} sub="roles configurados" />
      </div>


      <Tabs defaultValue="dotacion" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="dotacion" className="gap-2"><Users className="w-4 h-4" /> Dotación</TabsTrigger>
          <TabsTrigger value="vacaciones" className="gap-2">
            <Calendar className="w-4 h-4" /> Vacaciones
            {pendientes > 0 && <span className="ml-1 bg-yellow-500/20 text-yellow-500 text-xs px-1.5 rounded-full">{pendientes}</span>}
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2"><Shield className="w-4 h-4" /> Roles y Accesos</TabsTrigger>
        </TabsList>

        <TabsContent value="dotacion" className="space-y-4">

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, RUT o cargo..." className="pl-9" value={searchDot} onChange={e => setSearchDot(e.target.value)} />
            </div>
            <Select value={filterDepto} onValueChange={setFilterDepto}>
              <SelectTrigger className="w-44"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Departamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los deptos.</SelectItem>
                {["Ventas","Compras","Logística","RRHH","Inventario","TI"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ACTIVO">Activos</SelectItem>
                <SelectItem value="INACTIVO">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{dotacionFiltrada.length} resultado{dotacionFiltrada.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID","Empleado","Departamento","Cargo","Contrato","Rol","Estado","Acciones"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dotacionFiltrada.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No se encontraron empleados con los filtros aplicados.</td></tr>
                ) : dotacionFiltrada.map(emp => (
                  <tr key={emp.id_empleado} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{emp.id_empleado}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {emp.nombre[0]}{emp.apellidos[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emp.nombre} {emp.apellidos}</p>
                          <p className="text-xs text-muted-foreground">{emp.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{emp.departamento}</td>
                    <td className="px-4 py-3 text-foreground">{emp.cargo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{emp.tipo_contrato}</td>
                    <td className="px-4 py-3">{rolBadge(emp.rol_sistema)}</td>
                    <td className="px-4 py-3">{estadoBadge(emp.estado)}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetalleEmp(emp)}><Eye className="w-4 h-4 mr-2" />Ver detalle</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setDetalleEmp(emp); }}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                          {emp.estado === "ACTIVO" && (
                            <DropdownMenuItem className="text-red-500" onClick={() => setConfirmDesactivar(emp.id_empleado)}>
                              <UserMinus className="w-4 h-4 mr-2" />Desactivar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="vacaciones" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={filterEstadoSol} onValueChange={setFilterEstadoSol}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                <SelectItem value="APROBADA">Aprobadas</SelectItem>
                <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{solicitudesFiltradas.length} solicitud{solicitudesFiltradas.length !== 1 ? "es" : ""}</span>
          </div>

          <div className="space-y-3">
            {solicitudesFiltradas.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
                No hay solicitudes en este estado.
              </div>
            ) : solicitudesFiltradas.map(sol => (
              <div key={sol.id_solicitud} className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {sol.nombre_empleado.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{sol.nombre_empleado}</p>
                      <span className="text-xs text-muted-foreground">·</span>
                      <p className="text-xs text-muted-foreground">{sol.departamento}</p>
                      {solicitudBadge(sol.estado)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" /> {sol.fecha_inicio} → {sol.fecha_fin}
                      </span>
                      <span className="text-sm font-medium text-foreground">{sol.dias} días hábiles</span>
                    </div>
                    {sol.observaciones && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{sol.observaciones}"</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">Solicitado: {sol.fecha_solicitud} · {sol.id_solicitud}</p>
                  </div>
                </div>

                {sol.estado === "PENDIENTE" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleAprobarSolicitud(sol.id_solicitud)}>
                      <Check className="w-4 h-4 mr-1" /> Aprobar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                      onClick={() => { setRechazarId(sol.id_solicitud); setMotivoRechazo(""); }}>
                      <X className="w-4 h-4 mr-1" /> Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">


            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Distribución por Rol
              </h3>
              {(Object.entries(rolesCount) as [RolSistema, number][]).map(([rol, count]) => {
                const pct = Math.round((count / empleados.length) * 100);
                return (
                  <div key={rol} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      {rolBadge(rol)}
                      <span className="text-sm font-medium text-foreground">{count} empleado{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Dotación por Departamento
              </h3>
              {(Object.entries(deptosCount) as [Departamento, number][]).sort((a, b) => b[1] - a[1]).map(([depto, count]) => {
                const pct = Math.round((count / empleados.length) * 100);
                return (
                  <div key={depto} className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">{depto}</span>
                      <span className="text-sm text-muted-foreground">{count} · {pct}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-primary/70 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Matriz de Accesos por Perfil</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Módulos y formularios accesibles según rol del sistema</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Módulo / Acción</th>
                    {(["Admin Sistema","Admin RRHH","Jefe de Logística","Operador de Bodega","Empleado"] as RolSistema[]).map(r => (
                      <th key={r} className="text-center px-3 py-3 text-xs font-medium text-muted-foreground uppercase">{r.replace(" ", "\u00A0")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Alta de Empleado", perms: [true, true, false, false, false] },
                    { label: "Ver Dotación", perms: [true, true, false, false, false] },
                    { label: "Editar Empleado", perms: [true, true, false, false, false] },
                    { label: "Aprobación Vacaciones", perms: [true, true, false, false, false] },
                    { label: "Solicitar Vacaciones", perms: [true, true, true, true, true] },
                    { label: "Gestión de Roles", perms: [true, false, false, false, false] },
                    { label: "Crear OT Picking", perms: [true, false, true, false, false] },
                    { label: "Confirmar Picking", perms: [true, false, true, true, false] },
                    { label: "Registrar Recepción", perms: [true, false, true, true, false] },
                    { label: "Emitir Guía Despacho", perms: [true, false, true, false, false] },
                  ].map(({ label, perms }) => (
                    <tr key={label} className="border-b border-border hover:bg-accent/20">
                      <td className="px-4 py-2.5 text-foreground font-medium">{label}</td>
                      {perms.map((p, i) => (
                        <td key={i} className="text-center px-3 py-2.5">
                          {p ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>


      <AltaEmpleadoModal open={altaOpen} onClose={() => setAltaOpen(false)} onCrear={handleCrearEmpleado} roles={roleOptions} />

      <DetalleEmpleadoModal
        empleado={detalleEmp}
        open={!!detalleEmp}
        onClose={() => setDetalleEmp(null)}
        onDesactivar={handleDesactivar}
        onEditar={handleEditarEmpleado}
      />

      <Dialog open={!!confirmDesactivar} onOpenChange={() => setConfirmDesactivar(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="w-5 h-5 text-red-500" /> Confirmar Desactivación
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas desactivar al empleado{" "}
            <span className="font-semibold text-foreground">
              {empleados.find(e => e.id_empleado === confirmDesactivar)?.nombre}{" "}
              {empleados.find(e => e.id_empleado === confirmDesactivar)?.apellidos}
            </span>?
            Su acceso al sistema quedará inhabilitado.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDesactivar(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { handleDesactivar(confirmDesactivar!); setConfirmDesactivar(null); }}>
              <UserMinus className="w-4 h-4 mr-1" /> Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechazar solicitud */}
      <Dialog open={!!rechazarId} onOpenChange={() => setRechazarId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <X className="w-5 h-5 text-red-500" /> Rechazar Solicitud
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Motivo del rechazo (opcional)</label>
            <Input
              placeholder="Ej: Período crítico de operaciones..."
              value={motivoRechazo}
              onChange={e => setMotivoRechazo(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRechazarId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleRechazarSolicitud}>
              <X className="w-4 h-4 mr-1" /> Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}