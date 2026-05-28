SELECT setval(pg_get_serial_sequence('"RRHH"."RRHH_empleado"', 'id_empleado'), (SELECT MAX(id_empleado) FROM "RRHH"."RRHH_empleado"));
SELECT setval(pg_get_serial_sequence('"RRHH"."RRHH_solicitud"', 'id_solicitud'), (SELECT MAX(id_solicitud) FROM "RRHH"."RRHH_solicitud"));
SELECT setval(pg_get_serial_sequence('"RRHH"."RRHH_rol"', 'id_rol'), (SELECT MAX(id_rol) FROM "RRHH"."RRHH_rol"));
SELECT setval(pg_get_serial_sequence('"RRHH"."RRHH_usuario"', 'id_usuario'), (SELECT MAX(id_usuario) FROM "RRHH"."RRHH_usuario"));
