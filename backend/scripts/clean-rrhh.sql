UPDATE "Logistica"."log_picking" SET id_empleado = NULL;
UPDATE "Logistica"."log_transportista" SET id_empleado = NULL;
UPDATE "Logistica"."log_recepcion" SET id_empleado = NULL;
DELETE FROM "RRHH"."RRHH_solicitud";
DELETE FROM "RRHH"."RRHH_usuario";
DELETE FROM "RRHH"."RRHH_empleado";
DELETE FROM "RRHH"."RRHH_rol";
