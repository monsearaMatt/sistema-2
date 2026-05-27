-- Script SQL: Datos de ejemplo para módulo Logistica
-- Ejecutar en PostgreSQL contra los esquemas Logistica y RRHH

-- ========== LIMPIEZA (opcional) ==========
-- DELETE FROM "Logistica"."log_guia_despacho";
-- DELETE FROM "Logistica"."log_picking";
-- DELETE FROM "Logistica"."log_transportista";
-- DELETE FROM "Logistica"."direccion";

-- ========== DIRECCIONES (Logistica schema) ==========
INSERT INTO "Logistica"."direccion" (id_direccion, direccion, id_cliente) VALUES
(1, 'Av. Balmaceda 1234, La Serena', 1),
(2, 'Calle O''Higgins 567, Coquimbo', 2),
(3, 'Avenida Francisco de Aguirre 890, La Serena', 3),
(4, 'Camino del Puerto 111, Coquimbo', 1),
(5, 'La Florida 222, La Serena', 2),
(6, 'Avenida Costanera 333, Coquimbo', 4),
(7, 'Paseo Peatonal 444, La Serena', 3),
(8, 'Ruta 5 Norte Km 500, La Serena', 1),
(9, 'Calle Central 555, Coquimbo', 2),
(10, 'Sector Altamira 666, La Serena', 4);

-- ========== TRANSPORTISTAS (Logistica schema) ==========
-- Prerequisito: RRHH_empleado con id_empleado 8, 9, 10
INSERT INTO "Logistica"."log_transportista" (id_transportista, nombre_transp, patente_vehiculo, id_empleado) VALUES
(1, 'Pedro González Rodríguez', 'AABB11', 8),
(2, 'Juan Martínez López', 'CCDD22', 9),
(3, 'Carlos Fernández Díaz', 'EEFF33', 10),
(4, 'Miguel Rojas Sáez', 'GGHH44', 8),
(5, 'Andrés Yáñez Vega', 'IIJJ55', 9),
(6, 'Roberto Silva Araya', 'KKLL66', 10),
(7, 'Fernando Bravo Flores', 'MMNN77', 8),
(8, 'Javier Campos Oliva', 'OOPP88', 9);

-- ========== PICKINGS (log_picking - Logistica schema) ==========
-- Prerequisito: RRHH_empleado con id_empleado 5, 6, 7 (operarios bodega)
INSERT INTO "Logistica"."log_picking" (id_ot, id_pedido_venta, id_empleado, fecha_creacion, estado) VALUES
(1, 1001, 5, '2026-05-27 08:00:00', 'Completado'),
(2, 1002, 6, '2026-05-27 08:15:00', 'Completado'),
(3, 1003, 7, '2026-05-27 08:30:00', 'Completado'),
(4, 1004, 5, '2026-05-27 09:00:00', 'Completado'),
(5, 1005, 6, '2026-05-27 09:15:00', 'En Proceso'),
(6, 1006, NULL, '2026-05-27 09:30:00', 'Pendiente'),
(7, 1007, 7, '2026-05-27 10:00:00', 'Completado'),
(8, 1008, 5, '2026-05-27 10:15:00', 'En Proceso'),
(9, 1009, 6, '2026-05-27 10:30:00', 'Completado'),
(10, 1010, 7, '2026-05-27 11:00:00', 'Completado');

-- ========== GUÍAS DE DESPACHO (log_guia_despacho - Logistica schema) ==========
-- Conectan picking + transportista + dirección
INSERT INTO "Logistica"."log_guia_despacho" (id_guia, id_ot, id_transportista, id_direccion, fecha_emision) VALUES
(1, 1, 1, 1, '2026-05-27 10:00:00'),
(2, 2, 2, 2, '2026-05-27 10:30:00'),
(3, 3, 3, 3, '2026-05-27 11:00:00'),
(4, 4, 1, 4, '2026-05-27 11:30:00'),
(5, 7, 2, 5, '2026-05-27 12:00:00'),
(6, 9, 3, 6, '2026-05-27 12:30:00'),
(7, 10, 1, 7, '2026-05-27 13:00:00');

-- ========== VERIFICACIONES ==========
-- Ver total de registros por tabla
SELECT 'direccion' as tabla, COUNT(*) as count FROM "Logistica"."direccion"
UNION ALL
SELECT 'log_transportista', COUNT(*) FROM "Logistica"."log_transportista"
UNION ALL
SELECT 'log_picking', COUNT(*) FROM "Logistica"."log_picking"
UNION ALL
SELECT 'log_guia_despacho', COUNT(*) FROM "Logistica"."log_guia_despacho";

-- Ver pickings completados por empleado
SELECT id_empleado, COUNT(*) as pickings_completados 
FROM "Logistica"."log_picking" 
WHERE estado = 'Completado'
GROUP BY id_empleado
ORDER BY pickings_completados DESC;

-- Ver tiempo promedio de despacho (si hay fechas)
SELECT 
  AVG(EXTRACT(EPOCH FROM (g.fecha_emision - p.fecha_creacion)) / 3600) as promedio_horas
FROM "Logistica"."log_guia_despacho" g
JOIN "Logistica"."log_picking" p ON g.id_ot = p.id_ot
WHERE g.fecha_emision IS NOT NULL AND p.fecha_creacion IS NOT NULL;
