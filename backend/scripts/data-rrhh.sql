-- Script SQL: Datos de ejemplo para módulo RRHH
-- NO EJECUTAR hasta que se indique

-- ========== ROLES (RRHH schema) ==========
INSERT INTO "RRHH"."RRHH_rol" (id_rol, name_rol) VALUES
(1, 'Admin Sistema'),
(2, 'Admin RRHH'),
(3, 'Jefe de Logística'),
(4, 'Operador de Bodega'),
(5, 'Empleado');

-- ========== EMPLEADOS (RRHH schema) ==========
INSERT INTO "RRHH"."RRHH_empleado" (id_empleado, rut, nombre, id_rol, correo, telefono, estado) VALUES
(1, '12345678-9', 'Carlos Riquelme Soto', 4, 'c.riquelme@empresa.cl', '+56987654321', 'Activo'),
(2, '98765432-1', 'María González Pérez', 3, 'm.gonzalez@empresa.cl', '+56976543210', 'Activo'),
(3, '11223344-5', 'Jorge Vargas Muñoz', 5, 'j.vargas@empresa.cl', '+56965432109', 'Activo'),
(4, '55667788-K', 'Ana Martínez López', 5, 'a.martinez@empresa.cl', '+56954321098', 'Activo'),
(5, '33445566-7', 'Rodrigo Silva Castro', 2, 'r.silva@empresa.cl', '+56943210987', 'Activo'),
(6, '77889900-2', 'Valentina Rojas Herrera', 5, 'v.rojas@empresa.cl', '+56932109876', 'Activo'),
(7, '22334455-6', 'Felipe Torres Díaz', 1, 'f.torres@empresa.cl', '+56921098765', 'Activo'),
(8, '44556677-3', 'Catalina Fuentes Reyes', 5, 'c.fuentes@empresa.cl', '+56910987654', 'Inactivo'),
(9, '11334455-8', 'Pedro González Rodríguez', 4, 'p.gonzalez@empresa.cl', '+56988776655', 'Activo'),
(10, '22887766-0', 'Juan Martínez López', 4, 'j.martinez@empresa.cl', '+56977665544', 'Activo'),
(11, '33552211-4', 'Miguel Rojas Sáez', 4, 'm.rojas@empresa.cl', '+56966554433', 'Activo'),
(12, '44112233-9', 'Andrés Yáñez Vega', 4, 'a.yanez@empresa.cl', '+56955443322', 'Activo');

-- ========== SOLICITUDES (RRHH schema) ==========
INSERT INTO "RRHH"."RRHH_solicitud" (id_solicitud, id_empleado, tipo_solicitud, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, 'Vacaciones', '2026-06-10', '2026-06-20', 'Pendiente'),
(2, 3, 'Vacaciones', '2026-07-01', '2026-07-14', 'Pendiente'),
(3, 6, 'Vacaciones', '2026-06-03', '2026-06-07', 'Aprobada'),
(4, 4, 'Vacaciones', '2026-05-26', '2026-05-30', 'Rechazada'),
(5, 7, 'Vacaciones', '2026-08-01', '2026-08-15', 'Pendiente'),
(6, 2, 'Permiso', '2026-06-05', '2026-06-05', 'Aprobada'),
(7, 5, 'Permiso', '2026-06-08', '2026-06-08', 'Pendiente'),
(8, 8, 'Vacaciones', '2026-06-15', '2026-06-25', 'Pendiente');

-- ========== USUARIOS (RRHH schema) ==========
INSERT INTO "RRHH"."RRHH_usuario" (id_usuario, username, password, id_empleado) VALUES
(1, 'criquelme', 'changeme123', 1),
(2, 'mgonzalez', 'changeme123', 2),
(3, 'jvargas', 'changeme123', 3),
(4, 'rsilva', 'changeme123', 5);

-- ========== VERIFICACIONES ==========
SELECT 'RRHH_rol' as tabla, COUNT(*) as count FROM "RRHH"."RRHH_rol"
UNION ALL
SELECT 'RRHH_empleado', COUNT(*) FROM "RRHH"."RRHH_empleado"
UNION ALL
SELECT 'RRHH_solicitud', COUNT(*) FROM "RRHH"."RRHH_solicitud"
UNION ALL
SELECT 'RRHH_usuario', COUNT(*) FROM "RRHH"."RRHH_usuario";
