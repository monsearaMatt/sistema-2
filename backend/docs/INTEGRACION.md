# Documentación de Integración - Módulo de Logística (Sprint 3)

Este documento detalla las estrategias, flujos y especificaciones técnicas utilizadas para integrar el módulo de **Logística** con los demás componentes del mini-ERP (**Ventas**, **Compras**, **Inventario** y **Recursos Humanos**).

La arquitectura utiliza un **enfoque de integración híbrido**:
1. **Integración vía API REST (HTTP Client):** Con el módulo de Compras.
2. **Integración a Nivel de Base de Datos (Shared Schema/Prisma):** Con los módulos de Ventas, Inventario y RRHH.

---

## 1. Integración con el Módulo de Compras (API REST)

Para no saturar ni acoplar directamente las bases de datos de compra, la comunicación se realiza mediante llamadas HTTP REST.

### Arquitectura de Conexión
* **Cliente HTTP:** `ComprasClient` (ubicado en [compras.client.ts](file:///c:/Users/monse/OneDrive/Documentos/GitHub/sistema-2/backend/src/modules/logistica/infrastructure/compras.client.ts)) realiza peticiones nativas utilizando la función global `fetch` de Node.js.
* **Variable de Entorno:** Configurable mediante `COMPRAS_API_URL` (valor por defecto: `http://localhost:4000`).

### Endpoints Consumidos
* **Obtener Órdenes Enviadas:** 
  * Ruta externa: `GET {{COMPRAS_API_URL}}/api/buy-order/sended`
  * Propósito: Recuperar las órdenes de compra emitidas al proveedor listas para ser recepcionadas físicamente.
* **Actualizar Estado de OC:** 
  * Ruta externa: `PATCH {{COMPRAS_API_URL}}/api/buy-order/:id`
  * Propósito: Modificar el estado de la Orden de Compra en el backend de compras cuando se registra su ingreso en inventario.

---

## 2. Integración con Ventas, Inventario y RRHH (Esquema Compartido)

La consistencia y transaccionalidad de las operaciones críticas se aseguran utilizando múltiples esquemas de base de datos dentro de la misma instancia de PostgreSQL, orquestados mediante **Prisma Client**.

### A. Ventas (Esquema `"Ventas"`)
* **Consultas:** El backend lee directamente de `ventas_pedido` y `ventas_detalle` para generar las Órdenes de Trabajo (OT) de picking y cargar la información de despacho.
* **Estructura de Datos Relacionada:**
  * `ventas_pedido`: Contiene campos como `id_pedido`, `estado` (`'pendiente'`, `'pagado'`, `'enviado'`, `'completado'`), `id_cliente`.
  * `clientes`: Tabla de clientes a la que hace referencia el catálogo de direcciones.
* **Flujo Transaccional:** Al confirmarse el despacho de inventario, se actualiza el estado de la orden de venta en base de datos:
  ```typescript
  await tx.ventas_pedido.update({
    where: { id_pedido: salesOrder.id_pedido },
    data: { estado: 'enviado' },
  });
  ```

### B. Inventario (Esquema `"Inventario"`)
* **Actualización de Existencias:** En el despacho e ingresos físicos, se lee y actualiza la tabla de stock:
  * `Producto`: Campos `id_producto`, `codigo` (mapeado de ID numérico de venta a código SKU de inventario), `stock_actual`.
  * `inv_movimiento`: Registra la trazabilidad física.
* **Mapeo de Productos:**
  El backend realiza la traducción de identificadores numéricos de e-commerce (`ventas_detalle.id_producto`) a códigos de inventario (`Producto.codigo`):
  * `5001` ➔ `'ACC-001'` (Mouse Gaming)
  * `5005` ➔ `'ACC-010'` (Audífonos JBL)
  * `5010` ➔ `'NOT-011'` (ASUS TUF 15)
  * `5015` ➔ `'NOT-012'` (Lenovo)
  * `5020` ➔ `'NOT-090'` (ThinkPad X15)
  * `1` ➔ `'NOT-NOTE'` (Notebook AB)
* **Registro de Movimientos:**
  Se registra una bitácora en la tabla `inv_movimiento` según la operación:
  * **Salida de Inventario (Despacho):** Tipo `SALIDA`, referencia `"Despacho Picking OT #<id_ot>"`.
  * **Entrada de Inventario (Recepción):** Tipo `ENTRADA`, referencia `"Recepción Compra OC #<id_oc>"`.

### C. Recursos Humanos (Esquema `"RRHH"`)
* **Asociación de Empleados:** Se verifica la existencia del personal en la tabla `RRHH_empleado` para:
  * Asignar operarios de bodega a las OT de Picking.
  * Asignar choferes en el maestro de Transportistas.
  * Validar al empleado receptor de compras en bodega.

---

## 3. Seguridad: Autenticación y Autorización (Sprint 3)

La seguridad e integridad del flujo de integración se gestiona en la capa de control de accesos del backend:

* **Autenticación (JWT):** El endpoint `POST /rrhh/auth/login` valida credenciales en `rRHH_usuario` y firma un token JWT que incluye el `id_empleado`, `username` y `role`.
* **Guardias de Rutas (Guards):**
  * `JwtAuthGuard`: Valida que la cabecera del request posea un token JWT firmado y válido.
  * `RolesGuard`: Extrae el rol (`RRHH_rol.name_rol`) del JWT y restringe o permite el acceso según los privilegios configurados en los decoradores `@Roles(...)` (ej. requerir roles de administración o bodega en la creación de pickings automáticos desde maestros).

---

## 4. Validaciones Robustas (Calidad de Datos)

El backend aplica tres capas esenciales de validación de datos para garantizar consistencia transaccional:

1. **Validación de Entradas (Pipes):**
   * Configuración: `@UsePipes(new ValidationPipe({ transform: true }))` en controladores.
   * Valida tipos de datos, obligatoriedad y límites de valores usando decoradores de `class-validator` en DTOs.
2. **Validación de Reglas de Negocio en Despachos:**
   * Lanza `BadRequestException` si el pedido de ventas asociado a la OT ya cuenta con estado `'enviado'` o `'completado'`.
   * Verifica la existencia de cada producto en la base de datos de inventario.
   * Lanza un error e interrumpe la transacción de base de datos si el stock actual de un producto es menor que la cantidad solicitada.
3. **Validación en Flujo de Recepción de Compras:**
   * Valida la existencia previa de la Orden de Compra y el Empleado Receptor en la base de datos común.
   * Bloquea el procesamiento si se detectan intentos de registro de recepción duplicados para una misma Orden de Compra o si la mercadería ya fue ingresada al inventario.
