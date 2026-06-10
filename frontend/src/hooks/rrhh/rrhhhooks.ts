/**
 * hooks/rrhh/rrhhHooks.ts
 *
 * Todos los hooks del módulo RRHH.
 * Importar en RRHHPage.tsx y eliminar las definiciones locales equivalentes.
 *
 * Uso:
 *   import { useRoles, useEmpleados, ... } from "@/hooks/rrhh/rrhhHooks";
 *
 * Para activar backend real: cambiar USE_MOCK a false
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

// ─── SWITCH ───────────────────────────────────────────────────────────────────
export const USE_MOCK = false; 

export interface Rol {
  id_rol: number;
  name_rol: string;
}

export interface Empleado {
  id_empleado: string;
  rut: string;
  nombre: string;     
  id_rol: number;     
  correo: string;
  telefono: string;
  estado: "ACTIVO" | "INACTIVO";
  name_rol: string; 
}

export interface Solicitud {
  id_solicitud: string;
  id_empleado: string;
  nombre_empleado: string;  
  tipo_solicitud: string;
  fecha_inicio: string;     
  fecha_fin: string;        
  dias: number;             
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
}


export interface CrearEmpleadoDto {
  rut: string;
  nombre: string;  
  correo: string;
  telefono: string;
  id_rol: number;
}

export interface EditarEmpleadoDto {
  id_empleado: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  id_rol?: number;
}

export interface ResponderSolicitudDto {
  id_solicitud: string;
  estado: "APROBADA" | "RECHAZADA";

}

const MOCK_ROLES: Rol[] = [
  { id_rol: 1, name_rol: "Admin RRHH" },
  { id_rol: 2, name_rol: "Empleado" },
  { id_rol: 3, name_rol: "Jefe de Logística" },
  { id_rol: 4, name_rol: "Operador de Bodega" },
  { id_rol: 5, name_rol: "Admin Sistema" },
];

const MOCK_EMPLEADOS: Empleado[] = [
  { id_empleado: "EMP-001", rut: "12345678-9",  nombre: "Carlos Riquelme Soto",    id_rol: 4, correo: "c.riquelme@empresa.cl",  telefono: "+56 9 8765 4321", estado: "ACTIVO",   name_rol: "Operador de Bodega" },
  { id_empleado: "EMP-002", rut: "98765432-1",  nombre: "María González Pérez",    id_rol: 3, correo: "m.gonzalez@empresa.cl",  telefono: "+56 9 7654 3210", estado: "ACTIVO",   name_rol: "Jefe de Logística" },
  { id_empleado: "EMP-003", rut: "11223344-5",  nombre: "Jorge Vargas Muñoz",      id_rol: 2, correo: "j.vargas@empresa.cl",    telefono: "+56 9 6543 2109", estado: "ACTIVO",   name_rol: "Empleado" },
  { id_empleado: "EMP-004", rut: "55667788-K",  nombre: "Ana Martínez López",      id_rol: 2, correo: "a.martinez@empresa.cl",  telefono: "+56 9 5432 1098", estado: "ACTIVO",   name_rol: "Empleado" },
  { id_empleado: "EMP-005", rut: "33445566-7",  nombre: "Rodrigo Silva Castro",    id_rol: 1, correo: "r.silva@empresa.cl",     telefono: "+56 9 4321 0987", estado: "ACTIVO",   name_rol: "Admin RRHH" },
  { id_empleado: "EMP-006", rut: "77889900-2",  nombre: "Valentina Rojas Herrera", id_rol: 2, correo: "v.rojas@empresa.cl",     telefono: "+56 9 3210 9876", estado: "ACTIVO",   name_rol: "Empleado" },
  { id_empleado: "EMP-007", rut: "22334455-6",  nombre: "Felipe Torres Díaz",      id_rol: 5, correo: "f.torres@empresa.cl",    telefono: "+56 9 2109 8765", estado: "ACTIVO",   name_rol: "Admin Sistema" },
  { id_empleado: "EMP-008", rut: "44556677-3",  nombre: "Catalina Fuentes Reyes",  id_rol: 2, correo: "c.fuentes@empresa.cl",   telefono: "+56 9 1098 7654", estado: "INACTIVO", name_rol: "Empleado" },
];

const MOCK_SOLICITUDES: Solicitud[] = [
  { id_solicitud: "SOL-001", id_empleado: "EMP-001", nombre_empleado: "Carlos Riquelme Soto",    tipo_solicitud: "VACACIONES", fecha_inicio: "2026-06-10", fecha_fin: "2026-06-20", dias: 10, estado: "PENDIENTE" },
  { id_solicitud: "SOL-002", id_empleado: "EMP-003", nombre_empleado: "Jorge Vargas Muñoz",      tipo_solicitud: "VACACIONES", fecha_inicio: "2026-07-01", fecha_fin: "2026-07-14", dias: 14, estado: "PENDIENTE" },
  { id_solicitud: "SOL-003", id_empleado: "EMP-006", nombre_empleado: "Valentina Rojas Herrera", tipo_solicitud: "VACACIONES", fecha_inicio: "2026-06-03", fecha_fin: "2026-06-07", dias:  5, estado: "APROBADA"  },
  { id_solicitud: "SOL-004", id_empleado: "EMP-004", nombre_empleado: "Ana Martínez López",      tipo_solicitud: "VACACIONES", fecha_inicio: "2026-05-26", fecha_fin: "2026-05-30", dias:  5, estado: "RECHAZADA" },
  { id_solicitud: "SOL-005", id_empleado: "EMP-007", nombre_empleado: "Felipe Torres Díaz",      tipo_solicitud: "VACACIONES", fecha_inicio: "2026-08-01", fecha_fin: "2026-08-15", dias: 15, estado: "PENDIENTE" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

/**
 * useRoles
 * Lee la tabla RRHH_rol completa.
 * Usado para poblar el select de rol en los formularios.
 *
 * GET /rrhh/roles
 * Response: Rol[]
 */
export function useRoles() {
  return useQuery<Rol[]>({
    queryKey: ["rrhh_roles"],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      if (USE_MOCK) return MOCK_ROLES;
      return (await api.get("/rrhh/roles")).data;
    },
  });
}

/**
 * useEmpleados
 * Lee todos los registros de RRHH_empleado con JOIN a RRHH_rol.
 * El backend devuelve name_rol junto a cada empleado.
 *
 * GET /rrhh/empleados
 * Response: Empleado[]
 */
export function useEmpleados() {
  return useQuery<Empleado[]>({
    queryKey: ["rrhh_empleados"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_EMPLEADOS;
      return (await api.get("/rrhh/empleados")).data;
    },
  });
}

/**
 * useCrearEmpleado
 * Crea un nuevo registro en RRHH_empleado y uno en RRHH_usuario.
 * El backend genera id_empleado, crea el usuario con username=rut y password temporal=rut.
 *
 * POST /rrhh/empleados
 * Body: CrearEmpleadoDto
 * Response: Empleado (con id_empleado asignado y name_rol del JOIN)
 */
export function useCrearEmpleado(
  onSuccess?: () => void,
  onError?: (msg: string) => void,
) {
  const qc = useQueryClient();
  return useMutation<Empleado, Error, CrearEmpleadoDto>({
    mutationFn: async (body) => {
      if (USE_MOCK) {
        return {
          ...body,
          id_empleado: `EMP-${String(Date.now()).slice(-4)}`,
          estado: "ACTIVO" as const,
          name_rol: MOCK_ROLES.find(r => r.id_rol === body.id_rol)?.name_rol ?? "",
        };
      }
      return (await api.post("/rrhh/empleados", body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rrhh_empleados"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al crear empleado.");
    },
  });
}

/**
 * useEditarEmpleado
 * Actualiza los campos editables de RRHH_empleado.
 * Solo envía los campos que realmente existen en la tabla.
 *
 * PATCH /rrhh/empleados/:id_empleado
 * Body: EditarEmpleadoDto (sin id_empleado — va en la URL)
 * Response: Empleado actualizado (con name_rol del JOIN)
 */
export function useEditarEmpleado(
  onSuccess?: () => void,
  onError?: (msg: string) => void,
) {
  const qc = useQueryClient();
  return useMutation<Empleado, Error, EditarEmpleadoDto>({
    mutationFn: async ({ id_empleado, ...body }) => {
      if (USE_MOCK) {
        const base = MOCK_EMPLEADOS.find(e => e.id_empleado === id_empleado) ?? ({} as Empleado);
        return { ...base, ...body, id_empleado };
      }
      return (await api.patch(`/rrhh/empleados/${id_empleado}`, body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rrhh_empleados"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      onError?.(err.response?.data?.message ?? "Error al editar empleado.");
    },
  });
}

/**
 * useDesactivarEmpleado
 * Cambia el campo `estado` de RRHH_empleado a "INACTIVO".
 * No elimina el registro — baja lógica.
 *
 * PATCH /rrhh/empleados/:id_empleado/desactivar
 * Body: {} (vacío)
 * Response: { message: string }
 */
export function useDesactivarEmpleado(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id_empleado) => {
      if (USE_MOCK) return { message: "Empleado desactivado." };
      return (await api.patch(`/rrhh/empleados/${id_empleado}/desactivar`, {})).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rrhh_empleados"] });
      onSuccess?.();
    },
  });
}

/**
 * useSolicitudes
 * Lee todos los registros de RRHH_solicitud con JOIN a RRHH_empleado.
 * El backend calcula el campo `dias` y devuelve `nombre_empleado` del JOIN.
 *
 * GET /rrhh/solicitudes
 * Response: Solicitud[]
 */
export function useSolicitudes() {
  return useQuery<Solicitud[]>({
    queryKey: ["rrhh_solicitudes"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_SOLICITUDES;
      return (await api.get("/rrhh/solicitudes")).data;
    },
  });
}

/**
 * useResponderSolicitud
 * Cambia el campo `estado` de RRHH_solicitud a APROBADA o RECHAZADA.
 * ⚠ No envía observaciones — el campo no existe en la tabla.
 *
 * PATCH /rrhh/solicitudes/:id_solicitud
 * Body: { estado: "APROBADA" | "RECHAZADA" }
 * Response: { message: string }
 */
export function useResponderSolicitud(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, ResponderSolicitudDto>({
    mutationFn: async ({ id_solicitud, estado }) => {
      if (USE_MOCK) return { message: "Solicitud actualizada." };
      return (await api.patch(`/rrhh/solicitudes/${id_solicitud}`, { estado })).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rrhh_solicitudes"] });
      onSuccess?.();
    },
  });
}