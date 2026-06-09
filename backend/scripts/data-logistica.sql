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

-- Agregar transportistas para llegar a 10 registros (requisito mínimo)
INSERT INTO "Logistica"."log_transportista" (id_transportista, nombre_transp, patente_vehiculo, id_empleado) VALUES
(9, 'Sergio Peña Godoy', 'QQRR99', 10),
(10, 'Esteban Muñoz Ríos', 'SSTT00', 8);

-- Agregar transportistas para llegar a 10 registros (requisito mínimo)
INSERT INTO "Logistica"."log_transportista" (id_transportista, nombre_transp, patente_vehiculo, id_empleado) VALUES
(9, 'Sergio Peña Godoy', 'QQRR99', 10),
(10, 'Esteban Muñoz Ríos', 'SSTT00', 8);

-- Asegurar patentes únicas y en mayúsculas para el esquema endurecido
-- (ya vienen normalizadas en este dataset).

-- ========== PICKINGS (log_picking - Logistica schema) ==========
-- Prerequisito: RRHH_empleado con id_empleado 5, 6, 7 (operarios bodega)
-- Generar 120 pickings para cumplir la regla de la tabla crítica >=100 registros
-- Generar 120 pickings para cumplir la regla de la tabla crítica >=100 registros
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
(10, 1010, 7, '2026-05-27 11:00:00', 'Completado'),
(11, 1011, 5, '2026-05-27 11:15:00', 'Pendiente'),
(12, 1012, 6, '2026-05-27 11:30:00', 'Pendiente'),
(13, 1013, 7, '2026-05-27 11:45:00', 'Pendiente'),
(14, 1014, 5, '2026-05-27 12:00:00', 'En Proceso'),
(15, 1015, 6, '2026-05-27 12:15:00', 'Completado'),
(16, 1016, 7, '2026-05-27 12:30:00', 'Completado'),
(17, 1017, 5, '2026-05-27 12:45:00', 'Pendiente'),
(18, 1018, 6, '2026-05-27 13:00:00', 'En Proceso'),
(19, 1019, 7, '2026-05-27 13:15:00', 'Completado'),
(20, 1020, 5, '2026-05-27 13:30:00', 'Completado'),
(21, 1021, 6, '2026-05-27 13:45:00', 'Pendiente'),
(22, 1022, 7, '2026-05-27 14:00:00', 'Pendiente'),
(23, 1023, 5, '2026-05-27 14:15:00', 'En Proceso'),
(24, 1024, 6, '2026-05-27 14:30:00', 'Completado'),
(25, 1025, 7, '2026-05-27 14:45:00', 'Completado'),
(26, 1026, 5, '2026-05-27 15:00:00', 'Pendiente'),
(27, 1027, 6, '2026-05-27 15:15:00', 'En Proceso'),
(28, 1028, 7, '2026-05-27 15:30:00', 'Completado'),
(29, 1029, 5, '2026-05-27 15:45:00', 'Completado'),
(30, 1030, 6, '2026-05-27 16:00:00', 'Pendiente'),
(31, 1031, 7, '2026-05-27 16:15:00', 'Pendiente'),
(32, 1032, 5, '2026-05-27 16:30:00', 'En Proceso'),
(33, 1033, 6, '2026-05-27 16:45:00', 'Completado'),
(34, 1034, 7, '2026-05-27 17:00:00', 'Completado'),
(35, 1035, 5, '2026-05-27 17:15:00', 'Pendiente'),
(36, 1036, 6, '2026-05-27 17:30:00', 'En Proceso'),
(37, 1037, 7, '2026-05-27 17:45:00', 'Completado'),
(38, 1038, 5, '2026-05-27 18:00:00', 'Completado'),
(39, 1039, 6, '2026-05-27 18:15:00', 'Pendiente'),
(40, 1040, 7, '2026-05-27 18:30:00', 'Pendiente'),
(41, 1041, 5, '2026-05-27 18:45:00', 'En Proceso'),
(42, 1042, 6, '2026-05-27 19:00:00', 'Completado'),
(43, 1043, 7, '2026-05-27 19:15:00', 'Completado'),
(44, 1044, 5, '2026-05-27 19:30:00', 'Pendiente'),
(45, 1045, 6, '2026-05-27 19:45:00', 'En Proceso'),
(46, 1046, 7, '2026-05-27 20:00:00', 'Completado'),
(47, 1047, 5, '2026-05-27 20:15:00', 'Completado'),
(48, 1048, 6, '2026-05-27 20:30:00', 'Pendiente'),
(49, 1049, 7, '2026-05-27 20:45:00', 'Pendiente'),
(50, 1050, 5, '2026-05-27 21:00:00', 'En Proceso'),
(51, 1051, 6, '2026-05-27 21:15:00', 'Completado'),
(52, 1052, 7, '2026-05-27 21:30:00', 'Completado'),
(53, 1053, 5, '2026-05-27 21:45:00', 'Pendiente'),
(54, 1054, 6, '2026-05-27 22:00:00', 'En Proceso'),
(55, 1055, 7, '2026-05-27 22:15:00', 'Completado'),
(56, 1056, 5, '2026-05-27 22:30:00', 'Completado'),
(57, 1057, 6, '2026-05-27 22:45:00', 'Pendiente'),
(58, 1058, 7, '2026-05-27 23:00:00', 'Pendiente'),
(59, 1059, 5, '2026-05-27 23:15:00', 'En Proceso'),
(60, 1060, 6, '2026-05-27 23:30:00', 'Completado'),
(61, 1061, 7, '2026-05-28 08:00:00', 'Completado'),
(62, 1062, 5, '2026-05-28 08:15:00', 'Pendiente'),
(63, 1063, 6, '2026-05-28 08:30:00', 'En Proceso'),
(64, 1064, 7, '2026-05-28 08:45:00', 'Completado'),
(65, 1065, 5, '2026-05-28 09:00:00', 'Completado'),
(66, 1066, 6, '2026-05-28 09:15:00', 'Pendiente'),
(67, 1067, 7, '2026-05-28 09:30:00', 'Pendiente'),
(68, 1068, 5, '2026-05-28 09:45:00', 'En Proceso'),
(69, 1069, 6, '2026-05-28 10:00:00', 'Completado'),
(70, 1070, 7, '2026-05-28 10:15:00', 'Completado'),
(71, 1071, 5, '2026-05-28 10:30:00', 'Pendiente'),
(72, 1072, 6, '2026-05-28 10:45:00', 'En Proceso'),
(73, 1073, 7, '2026-05-28 11:00:00', 'Completado'),
(74, 1074, 5, '2026-05-28 11:15:00', 'Completado'),
(75, 1075, 6, '2026-05-28 11:30:00', 'Pendiente'),
(76, 1076, 7, '2026-05-28 11:45:00', 'En Proceso'),
(77, 1077, 5, '2026-05-28 12:00:00', 'Completado'),
(78, 1078, 6, '2026-05-28 12:15:00', 'Completado'),
(79, 1079, 7, '2026-05-28 12:30:00', 'Pendiente'),
(80, 1080, 5, '2026-05-28 12:45:00', 'En Proceso'),
(81, 1081, 6, '2026-05-28 13:00:00', 'Completado'),
(82, 1082, 7, '2026-05-28 13:15:00', 'Completado'),
(83, 1083, 5, '2026-05-28 13:30:00', 'Pendiente'),
(84, 1084, 6, '2026-05-28 13:45:00', 'En Proceso'),
(85, 1085, 7, '2026-05-28 14:00:00', 'Completado'),
(86, 1086, 5, '2026-05-28 14:15:00', 'Completado'),
(87, 1087, 6, '2026-05-28 14:30:00', 'Pendiente'),
(88, 1088, 7, '2026-05-28 14:45:00', 'En Proceso'),
(89, 1089, 5, '2026-05-28 15:00:00', 'Completado'),
(90, 1090, 6, '2026-05-28 15:15:00', 'Completado'),
(91, 1091, 7, '2026-05-28 15:30:00', 'Pendiente'),
(92, 1092, 5, '2026-05-28 15:45:00', 'En Proceso'),
(93, 1093, 6, '2026-05-28 16:00:00', 'Completado'),
(94, 1094, 7, '2026-05-28 16:15:00', 'Completado'),
(95, 1095, 5, '2026-05-28 16:30:00', 'Pendiente'),
(96, 1096, 6, '2026-05-28 16:45:00', 'En Proceso'),
(97, 1097, 7, '2026-05-28 17:00:00', 'Completado'),
(98, 1098, 5, '2026-05-28 17:15:00', 'Completado'),
(99, 1099, 6, '2026-05-28 17:30:00', 'Pendiente'),
(100, 1100, 7, '2026-05-28 17:45:00', 'En Proceso'),
(101, 1101, 5, '2026-05-28 18:00:00', 'Completado'),
(102, 1102, 6, '2026-05-28 18:15:00', 'Completado'),
(103, 1103, 7, '2026-05-28 18:30:00', 'Pendiente'),
(104, 1104, 5, '2026-05-28 18:45:00', 'En Proceso'),
(105, 1105, 6, '2026-05-28 19:00:00', 'Completado'),
(106, 1106, 7, '2026-05-28 19:15:00', 'Completado'),
(107, 1107, 5, '2026-05-28 19:30:00', 'Pendiente'),
(108, 1108, 6, '2026-05-28 19:45:00', 'En Proceso'),
(109, 1109, 7, '2026-05-28 20:00:00', 'Completado'),
(110, 1110, 5, '2026-05-28 20:15:00', 'Completado'),
(111, 1111, 6, '2026-05-28 20:30:00', 'Pendiente'),
(112, 1112, 7, '2026-05-28 20:45:00', 'En Proceso'),
(113, 1113, 5, '2026-05-28 21:00:00', 'Completado'),
(114, 1114, 6, '2026-05-28 21:15:00', 'Completado'),
(115, 1115, 7, '2026-05-28 21:30:00', 'Pendiente'),
(116, 1116, 5, '2026-05-28 21:45:00', 'En Proceso'),
(117, 1117, 6, '2026-05-28 22:00:00', 'Completado'),
(118, 1118, 7, '2026-05-28 22:15:00', 'Completado'),
(119, 1119, 5, '2026-05-28 22:30:00', 'Pendiente'),
(120, 1120, 6, '2026-05-28 22:45:00', 'En Proceso');
(11, 1011, 5, '2026-05-27 11:15:00', 'Pendiente'),
(12, 1012, 6, '2026-05-27 11:30:00', 'Pendiente'),
(13, 1013, 7, '2026-05-27 11:45:00', 'Pendiente'),
(14, 1014, 5, '2026-05-27 12:00:00', 'En Proceso'),
(15, 1015, 6, '2026-05-27 12:15:00', 'Completado'),
(16, 1016, 7, '2026-05-27 12:30:00', 'Completado'),
(17, 1017, 5, '2026-05-27 12:45:00', 'Pendiente'),
(18, 1018, 6, '2026-05-27 13:00:00', 'En Proceso'),
(19, 1019, 7, '2026-05-27 13:15:00', 'Completado'),
(20, 1020, 5, '2026-05-27 13:30:00', 'Completado'),
(21, 1021, 6, '2026-05-27 13:45:00', 'Pendiente'),
(22, 1022, 7, '2026-05-27 14:00:00', 'Pendiente'),
(23, 1023, 5, '2026-05-27 14:15:00', 'En Proceso'),
(24, 1024, 6, '2026-05-27 14:30:00', 'Completado'),
(25, 1025, 7, '2026-05-27 14:45:00', 'Completado'),
(26, 1026, 5, '2026-05-27 15:00:00', 'Pendiente'),
(27, 1027, 6, '2026-05-27 15:15:00', 'En Proceso'),
(28, 1028, 7, '2026-05-27 15:30:00', 'Completado'),
(29, 1029, 5, '2026-05-27 15:45:00', 'Completado'),
(30, 1030, 6, '2026-05-27 16:00:00', 'Pendiente'),
(31, 1031, 7, '2026-05-27 16:15:00', 'Pendiente'),
(32, 1032, 5, '2026-05-27 16:30:00', 'En Proceso'),
(33, 1033, 6, '2026-05-27 16:45:00', 'Completado'),
(34, 1034, 7, '2026-05-27 17:00:00', 'Completado'),
(35, 1035, 5, '2026-05-27 17:15:00', 'Pendiente'),
(36, 1036, 6, '2026-05-27 17:30:00', 'En Proceso'),
(37, 1037, 7, '2026-05-27 17:45:00', 'Completado'),
(38, 1038, 5, '2026-05-27 18:00:00', 'Completado'),
(39, 1039, 6, '2026-05-27 18:15:00', 'Pendiente'),
(40, 1040, 7, '2026-05-27 18:30:00', 'Pendiente'),
(41, 1041, 5, '2026-05-27 18:45:00', 'En Proceso'),
(42, 1042, 6, '2026-05-27 19:00:00', 'Completado'),
(43, 1043, 7, '2026-05-27 19:15:00', 'Completado'),
(44, 1044, 5, '2026-05-27 19:30:00', 'Pendiente'),
(45, 1045, 6, '2026-05-27 19:45:00', 'En Proceso'),
(46, 1046, 7, '2026-05-27 20:00:00', 'Completado'),
(47, 1047, 5, '2026-05-27 20:15:00', 'Completado'),
(48, 1048, 6, '2026-05-27 20:30:00', 'Pendiente'),
(49, 1049, 7, '2026-05-27 20:45:00', 'Pendiente'),
(50, 1050, 5, '2026-05-27 21:00:00', 'En Proceso'),
(51, 1051, 6, '2026-05-27 21:15:00', 'Completado'),
(52, 1052, 7, '2026-05-27 21:30:00', 'Completado'),
(53, 1053, 5, '2026-05-27 21:45:00', 'Pendiente'),
(54, 1054, 6, '2026-05-27 22:00:00', 'En Proceso'),
(55, 1055, 7, '2026-05-27 22:15:00', 'Completado'),
(56, 1056, 5, '2026-05-27 22:30:00', 'Completado'),
(57, 1057, 6, '2026-05-27 22:45:00', 'Pendiente'),
(58, 1058, 7, '2026-05-27 23:00:00', 'Pendiente'),
(59, 1059, 5, '2026-05-27 23:15:00', 'En Proceso'),
(60, 1060, 6, '2026-05-27 23:30:00', 'Completado'),
(61, 1061, 7, '2026-05-28 08:00:00', 'Completado'),
(62, 1062, 5, '2026-05-28 08:15:00', 'Pendiente'),
(63, 1063, 6, '2026-05-28 08:30:00', 'En Proceso'),
(64, 1064, 7, '2026-05-28 08:45:00', 'Completado'),
(65, 1065, 5, '2026-05-28 09:00:00', 'Completado'),
(66, 1066, 6, '2026-05-28 09:15:00', 'Pendiente'),
(67, 1067, 7, '2026-05-28 09:30:00', 'Pendiente'),
(68, 1068, 5, '2026-05-28 09:45:00', 'En Proceso'),
(69, 1069, 6, '2026-05-28 10:00:00', 'Completado'),
(70, 1070, 7, '2026-05-28 10:15:00', 'Completado'),
(71, 1071, 5, '2026-05-28 10:30:00', 'Pendiente'),
(72, 1072, 6, '2026-05-28 10:45:00', 'En Proceso'),
(73, 1073, 7, '2026-05-28 11:00:00', 'Completado'),
(74, 1074, 5, '2026-05-28 11:15:00', 'Completado'),
(75, 1075, 6, '2026-05-28 11:30:00', 'Pendiente'),
(76, 1076, 7, '2026-05-28 11:45:00', 'En Proceso'),
(77, 1077, 5, '2026-05-28 12:00:00', 'Completado'),
(78, 1078, 6, '2026-05-28 12:15:00', 'Completado'),
(79, 1079, 7, '2026-05-28 12:30:00', 'Pendiente'),
(80, 1080, 5, '2026-05-28 12:45:00', 'En Proceso'),
(81, 1081, 6, '2026-05-28 13:00:00', 'Completado'),
(82, 1082, 7, '2026-05-28 13:15:00', 'Completado'),
(83, 1083, 5, '2026-05-28 13:30:00', 'Pendiente'),
(84, 1084, 6, '2026-05-28 13:45:00', 'En Proceso'),
(85, 1085, 7, '2026-05-28 14:00:00', 'Completado'),
(86, 1086, 5, '2026-05-28 14:15:00', 'Completado'),
(87, 1087, 6, '2026-05-28 14:30:00', 'Pendiente'),
(88, 1088, 7, '2026-05-28 14:45:00', 'En Proceso'),
(89, 1089, 5, '2026-05-28 15:00:00', 'Completado'),
(90, 1090, 6, '2026-05-28 15:15:00', 'Completado'),
(91, 1091, 7, '2026-05-28 15:30:00', 'Pendiente'),
(92, 1092, 5, '2026-05-28 15:45:00', 'En Proceso'),
(93, 1093, 6, '2026-05-28 16:00:00', 'Completado'),
(94, 1094, 7, '2026-05-28 16:15:00', 'Completado'),
(95, 1095, 5, '2026-05-28 16:30:00', 'Pendiente'),
(96, 1096, 6, '2026-05-28 16:45:00', 'En Proceso'),
(97, 1097, 7, '2026-05-28 17:00:00', 'Completado'),
(98, 1098, 5, '2026-05-28 17:15:00', 'Completado'),
(99, 1099, 6, '2026-05-28 17:30:00', 'Pendiente'),
(100, 1100, 7, '2026-05-28 17:45:00', 'En Proceso'),
(101, 1101, 5, '2026-05-28 18:00:00', 'Completado'),
(102, 1102, 6, '2026-05-28 18:15:00', 'Completado'),
(103, 1103, 7, '2026-05-28 18:30:00', 'Pendiente'),
(104, 1104, 5, '2026-05-28 18:45:00', 'En Proceso'),
(105, 1105, 6, '2026-05-28 19:00:00', 'Completado'),
(106, 1106, 7, '2026-05-28 19:15:00', 'Completado'),
(107, 1107, 5, '2026-05-28 19:30:00', 'Pendiente'),
(108, 1108, 6, '2026-05-28 19:45:00', 'En Proceso'),
(109, 1109, 7, '2026-05-28 20:00:00', 'Completado'),
(110, 1110, 5, '2026-05-28 20:15:00', 'Completado'),
(111, 1111, 6, '2026-05-28 20:30:00', 'Pendiente'),
(112, 1112, 7, '2026-05-28 20:45:00', 'En Proceso'),
(113, 1113, 5, '2026-05-28 21:00:00', 'Completado'),
(114, 1114, 6, '2026-05-28 21:15:00', 'Completado'),
(115, 1115, 7, '2026-05-28 21:30:00', 'Pendiente'),
(116, 1116, 5, '2026-05-28 21:45:00', 'En Proceso'),
(117, 1117, 6, '2026-05-28 22:00:00', 'Completado'),
(118, 1118, 7, '2026-05-28 22:15:00', 'Completado'),
(119, 1119, 5, '2026-05-28 22:30:00', 'Pendiente'),
(120, 1120, 6, '2026-05-28 22:45:00', 'En Proceso');

-- El schema actual define defaults para fecha_creacion y estado,
-- pero se preservan explícitamente en el seed para mantener el dataset estable.

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

-- Completar guías para llegar a 10 registros
INSERT INTO "Logistica"."log_guia_despacho" (id_guia, id_ot, id_transportista, id_direccion, fecha_emision) VALUES
(8, 11, 2, 8, '2026-05-27 13:30:00'),
(9, 12, 3, 9, '2026-05-27 14:00:00'),
(10, 13, 1, 10, '2026-05-27 14:30:00');

-- Completar guías para llegar a 10 registros
INSERT INTO "Logistica"."log_guia_despacho" (id_guia, id_ot, id_transportista, id_direccion, fecha_emision) VALUES
(8, 11, 2, 8, '2026-05-27 13:30:00'),
(9, 12, 3, 9, '2026-05-27 14:00:00'),
(10, 13, 1, 10, '2026-05-27 14:30:00');

-- El schema actual marca las FK como obligatorias y fecha_emision con default.
-- Se siguen seteando explícitamente para reproducibilidad del seed.

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
