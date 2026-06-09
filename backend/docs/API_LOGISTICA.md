# Documentación API - Módulo Logística

Resumen de endpoints implementados para Sprint 2 (Logística).

Base URL (variable): `{{baseUrl}}` (ej. `http://localhost:3000`)

1) Transportistas
- POST /logistica/transportistas
  - Descripción: Crea un transportista asociado a un empleado RRHH.
  - Body (JSON):
    - `nombre_transp` (string, 3-100)
    - `patente_vehiculo` (string, 6-8, mayúsculas y dígitos)
    - `id_empleado` (int, positivo)
  - Respuesta: 201 Created -> objeto `log_transportista` creado.

- GET /logistica/transportistas
  - Descripción: Lista todos los transportistas con su empleado asociado.
  - Respuesta: 200 OK -> array de transportistas con `RRHH_empleado` incluido.

2) Direcciones
- POST /logistica/direcciones
  - Body (JSON):
    - `direccion` (string, 5-255)
    - `id_cliente` (int, positivo)
  - Respuesta: 201 Created -> objeto `direccion` creado.

- GET /logistica/direcciones
  - Respuesta: 200 OK -> array de direcciones.

3) Pickings (OT)
- POST /logistica/pickings
  - Body (JSON):
    - `id_pedido_venta` (int, opcional)
    - `estado` (string, opcional: 'Pendiente' | 'En Proceso' | 'Completado')
  - Respuesta: 201 Created -> objeto `log_picking` creado.

- PATCH /logistica/pickings/:id/assign
  - Path param: `id` = id_ot
  - Body: `{ "id_empleado": <int> }`
  - Acción: asigna un empleado y pone `estado = 'En Proceso'`.

- PATCH /logistica/pickings/:id/complete
  - Acción: marca `estado = 'Completado'`.

- GET /logistica/pickings
  - Respuesta: 200 OK -> array de pickings.

4) Guías de despacho
- POST /logistica/guias
  - Body (JSON):
    - `id_ot` (int, positivo)
    - `id_transportista` (int, positivo)
    - `id_direccion` (int, positivo)
  - Acción: crea `log_guia_despacho` conectando `log_picking`, `log_transportista` y `direccion`.

- GET /logistica/guias
  - Respuesta: 200 OK -> array de guías con `direccion`, `log_picking` y `log_transportista` incluidos.

Notas importantes
- Validaciones: el backend aplica `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`. Los campos extra o no permitidos generan 400.
- Autorización: aún no implementada (Sprint 3).

Ejemplo rápido (curl)

Crear transportista:

```bash
curl -X POST '{{baseUrl}}/logistica/transportistas' \
  -H 'Content-Type: application/json' \
  -d '{"nombre_transp":"Pedro", "patente_vehiculo":"ABC123", "id_empleado":9}'
```

Crear guía (ejemplo):

```bash
curl -X POST '{{baseUrl}}/logistica/guias' \
  -H 'Content-Type: application/json' \
  -d '{"id_ot":1, "id_transportista":1, "id_direccion":1}'
```

---
Archivo generado automáticamente para referencia rápida del equipo.
