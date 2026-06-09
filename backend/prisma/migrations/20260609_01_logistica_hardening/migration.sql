-- Logistica hardening migration
-- Ajusta columnas requeridas, defaults e índices para el módulo Logistica.

-- direccion
ALTER TABLE "Logistica"."direccion"
  ALTER COLUMN "direccion" SET NOT NULL,
  ALTER COLUMN "id_cliente" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_direccion_cliente"
  ON "Logistica"."direccion" ("id_cliente");

-- log_transportista
ALTER TABLE "Logistica"."log_transportista"
  ALTER COLUMN "nombre_transp" SET NOT NULL,
  ALTER COLUMN "patente_vehiculo" SET NOT NULL,
  ALTER COLUMN "id_empleado" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'log_transportista_patente_vehiculo_key'
  ) THEN
    ALTER TABLE "Logistica"."log_transportista"
      ADD CONSTRAINT "log_transportista_patente_vehiculo_key" UNIQUE ("patente_vehiculo");
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_transportista_empleado"
  ON "Logistica"."log_transportista" ("id_empleado");

-- log_picking
ALTER TABLE "Logistica"."log_picking"
  ALTER COLUMN "fecha_creacion" SET DEFAULT now(),
  ALTER COLUMN "estado" SET DEFAULT 'Pendiente';

CREATE INDEX IF NOT EXISTS "idx_picking_pedido_venta"
  ON "Logistica"."log_picking" ("id_pedido_venta");

CREATE INDEX IF NOT EXISTS "idx_picking_empleado"
  ON "Logistica"."log_picking" ("id_empleado");

-- log_guia_despacho
ALTER TABLE "Logistica"."log_guia_despacho"
  ALTER COLUMN "id_ot" SET NOT NULL,
  ALTER COLUMN "id_transportista" SET NOT NULL,
  ALTER COLUMN "id_direccion" SET NOT NULL,
  ALTER COLUMN "fecha_emision" SET DEFAULT now();

CREATE INDEX IF NOT EXISTS "idx_guia_ot"
  ON "Logistica"."log_guia_despacho" ("id_ot");

CREATE INDEX IF NOT EXISTS "idx_guia_transportista"
  ON "Logistica"."log_guia_despacho" ("id_transportista");

CREATE INDEX IF NOT EXISTS "idx_guia_direccion"
  ON "Logistica"."log_guia_despacho" ("id_direccion");
