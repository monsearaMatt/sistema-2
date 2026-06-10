-- Script: Maestros canónicos (DDL + DML)
-- Crea tablas y datos de ejemplo para clientes, productos y proveedores
-- Ejecutar en PostgreSQL antes de cargar semillas de módulos

-- Crear esquema 'Maestros' si no existe
CREATE SCHEMA IF NOT EXISTS "Maestros";

-- Tabla: clientes
CREATE TABLE IF NOT EXISTS "Maestros"."cliente" (
  id_cliente SERIAL PRIMARY KEY,
  rut VARCHAR(20),
  nombre VARCHAR(200) NOT NULL,
  correo VARCHAR(150),
  telefono VARCHAR(50),
  direccion VARCHAR(255)
);

-- Tabla: productos (usar UUID para coincidir con compras externas)
CREATE TABLE IF NOT EXISTS "Maestros"."producto" (
  id_producto UUID PRIMARY KEY,
  sku VARCHAR(100),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio_unitario NUMERIC(12,2)
);

-- Tabla: proveedores
CREATE TABLE IF NOT EXISTS "Maestros"."proveedor" (
  id_proveedor UUID PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  contacto VARCHAR(150),
  correo VARCHAR(150)
);

-- Insertar 10 clientes de ejemplo
INSERT INTO "Maestros"."cliente" (id_cliente, rut, nombre, correo, telefono, direccion) VALUES
(1, '11111111-1', 'Cliente Uno', 'cliente1@empresa.cl', '+56911111111', 'Calle 1 #100'),
(2, '22222222-2', 'Cliente Dos', 'cliente2@empresa.cl', '+56922222222', 'Calle 2 #200'),
(3, '33333333-3', 'Cliente Tres', 'cliente3@empresa.cl', '+56933333333', 'Calle 3 #300'),
(4, '44444444-4', 'Cliente Cuatro', 'cliente4@empresa.cl', '+56944444444', 'Calle 4 #400'),
(5, '55555555-5', 'Cliente Cinco', 'cliente5@empresa.cl', '+56955555555', 'Calle 5 #500'),
(6, '66666666-6', 'Cliente Seis', 'cliente6@empresa.cl', '+56966666666', 'Calle 6 #600'),
(7, '77777777-7', 'Cliente Siete', 'cliente7@empresa.cl', '+56977777777', 'Calle 7 #700'),
(8, '88888888-8', 'Cliente Ocho', 'cliente8@empresa.cl', '+56988888888', 'Calle 8 #800'),
(9, '99999999-9', 'Cliente Nueve', 'cliente9@empresa.cl', '+56999999999', 'Calle 9 #900'),
(10, '10101010-0', 'Cliente Diez', 'cliente10@empresa.cl', '+56910101010', 'Calle 10 #1000');

-- Insertar 10 productos (incluyendo el UUID de ejemplo enviado por Compras)
INSERT INTO "Maestros"."producto" (id_producto, sku, nombre, descripcion, precio_unitario) VALUES
('860f8184-7839-4df3-92d1-ab1960449030', 'NB-001', 'notebook', 'Notebook modelo ejemplo', 10000.00),
('11111111-2222-3333-4444-555555555555', 'PR-002', 'Mouse', 'Mouse USB', 15.50),
('22222222-3333-4444-5555-666666666666', 'PR-003', 'Teclado', 'Teclado mecánico', 45.00),
('33333333-4444-5555-6666-777777777777', 'PR-004', 'Monitor 24"', 'Monitor FullHD 24 pulgadas', 150.00),
('44444444-5555-6666-7777-888888888888', 'PR-005', 'Impresora', 'Impresora láser', 250.00),
('55555555-6666-7777-8888-999999999999', 'PR-006', 'Router', 'Router WiFi AC', 80.00),
('66666666-7777-8888-9999-000000000000', 'PR-007', 'Scanner', 'Scanner A4', 60.00),
('77777777-8888-9999-0000-111111111111', 'PR-008', 'SSD 1TB', 'Disco SSD 1TB', 120.00),
('88888888-9999-0000-1111-222222222222', 'PR-009', 'Memoria 16GB', 'RAM DDR4 16GB', 70.00),
('99999999-0000-1111-2222-333333333333', 'PR-010', 'Cargador', 'Cargador universal', 25.00);

-- Insertar 10 proveedores
INSERT INTO "Maestros"."proveedor" (id_proveedor, nombre, contacto, correo) VALUES
('a1111111-1111-1111-1111-111111111111', 'Proveedor Uno', 'Contacto Uno', 'prov1@proveedor.cl'),
('b2222222-2222-2222-2222-222222222222', 'Proveedor Dos', 'Contacto Dos', 'prov2@proveedor.cl'),
('c3333333-3333-3333-3333-333333333333', 'Proveedor Tres', 'Contacto Tres', 'prov3@proveedor.cl'),
('d4444444-4444-4444-4444-444444444444', 'Proveedor Cuatro', 'Contacto Cuatro', 'prov4@proveedor.cl'),
('e5555555-5555-5555-5555-555555555555', 'Proveedor Cinco', 'Contacto Cinco', 'prov5@proveedor.cl'),
('f6666666-6666-6666-6666-666666666666', 'Proveedor Seis', 'Contacto Seis', 'prov6@proveedor.cl'),
('07777777-7777-7777-7777-777777777777', 'Proveedor Siete', 'Contacto Siete', 'prov7@proveedor.cl'),
('08888888-8888-8888-8888-888888888888', 'Proveedor Ocho', 'Contacto Ocho', 'prov8@proveedor.cl'),
('09999999-9999-9999-9999-999999999999', 'Proveedor Nueve', 'Contacto Nueve', 'prov9@proveedor.cl'),
('00000000-0000-0000-0000-000000000000', 'Proveedor Diez', 'Contacto Diez', 'prov10@proveedor.cl');

-- Verificación de conteos
SELECT 'cliente' as tabla, COUNT(*) as count FROM "Maestros"."cliente"
UNION ALL
SELECT 'producto', COUNT(*) FROM "Maestros"."producto"
UNION ALL
SELECT 'proveedor', COUNT(*) FROM "Maestros"."proveedor";
