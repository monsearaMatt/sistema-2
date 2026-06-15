ALTER TABLE "RRHH"."RRHH_empleado" ADD CONSTRAINT "RRHH_empleado_rut_key" UNIQUE ("rut");
ALTER TABLE "RRHH"."RRHH_usuario" ADD CONSTRAINT "RRHH_usuario_username_key" UNIQUE ("username");
ALTER TABLE "RRHH"."RRHH_rol" ADD CONSTRAINT "RRHH_rol_name_rol_key" UNIQUE ("name_rol");
