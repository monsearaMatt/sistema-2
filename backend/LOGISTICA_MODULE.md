# Módulo Logistica - Documentación Completa

## 📋 Estructura del Módulo

```
src/modules/logistica/
├── application/
│   ├── direccion.service.ts      # Servicio de Direcciones
│   ├── transportista.service.ts  # Servicio de Transportistas
│   ├── picking.service.ts        # Servicio de Picking (OT)
│   ├── guia.service.ts           # Servicio de Guías de Despacho
│   └── kpi.service.ts            # Servicio de KPIs
├── presentation/
│   ├── direccion.controller.ts      # Controlador de Direcciones
│   ├── transportista.controller.ts  # Controlador de Transportistas
│   ├── picking.controller.ts        # Controlador de Picking
│   ├── guia.controller.ts           # Controlador de Guías
│   ├── kpi.controller.ts            # Controlador de KPIs
│   └── dto/
│       ├── crear-direccion.dto.ts
│       ├── crear-transportista.dto.ts
│       ├── crear-picking.dto.ts
│       └── crear-guia-despacho.dto.ts
└── logistica.module.ts
```

## 🎯 Endpoints Disponibles

### 1. Direcciones
- **POST** `/logistica/direcciones` - Crear dirección
- **GET** `/logistica/direcciones` - Listar todas las direcciones

### 2. Transportistas
- **POST** `/logistica/transportistas` - Crear transportista
- **GET** `/logistica/transportistas` - Listar todos los transportistas

### 3. Picking (Órdenes de Trabajo)
- **POST** `/logistica/pickings` - Crear picking
- **PATCH** `/logistica/pickings/:id/assign` - Asignar empleado
- **PATCH** `/logistica/pickings/:id/complete` - Marcar como completado
- **GET** `/logistica/pickings` - Listar pickings

### 4. Guías de Despacho
- **POST** `/logistica/guias` - Crear guía
- **GET** `/logistica/guias` - Listar guías

### 5. KPIs
- **GET** `/logistica/kpis/productividad` - Productividad por empleado
- **GET** `/logistica/kpis/tiempo-despacho` - Tiempo promedio de despacho

## 📝 Ejemplos de Uso (cURL)

### Crear Dirección
```bash
curl -X POST http://localhost:3000/logistica/direcciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_direccion": 1,
    "direccion": "Av. Balmaceda 1234, La Serena",
    "id_cliente": 1
  }'
```

### Listar Direcciones
```bash
curl http://localhost:3000/logistica/direcciones
```

### Crear Transportista
```bash
curl -X POST http://localhost:3000/logistica/transportistas \
  -H "Content-Type: application/json" \
  -d '{
    "id_transportista": 1,
    "nombre_transp": "Pedro González",
    "patente_vehiculo": "AABB11",
    "id_empleado": 8
  }'
```

### Listar Transportistas
```bash
curl http://localhost:3000/logistica/transportistas
```

### Crear Picking
```bash
curl -X POST http://localhost:3000/logistica/pickings \
  -H "Content-Type: application/json" \
  -d '{
    "id_ot": 1,
    "id_pedido_venta": 100,
    "estado": "Pendiente"
  }'
```

### Asignar Empleado a Picking
```bash
curl -X PATCH http://localhost:3000/logistica/pickings/1/assign \
  -H "Content-Type: application/json" \
  -d '{
    "id_empleado": 5
  }'
```

### Completar Picking
```bash
curl -X PATCH http://localhost:3000/logistica/pickings/1/complete
```

### Listar Pickings
```bash
curl http://localhost:3000/logistica/pickings
```

### Crear Guía de Despacho
```bash
curl -X POST http://localhost:3000/logistica/guias \
  -H "Content-Type: application/json" \
  -d '{
    "id_guia": 1,
    "id_ot": 1,
    "id_transportista": 1,
    "id_direccion": 1
  }'
```

### Listar Guías
```bash
curl http://localhost:3000/logistica/guias
```

### Obtener KPIs de Productividad
```bash
curl http://localhost:3000/logistica/kpis/productividad
```

### Obtener Tiempo Promedio de Despacho
```bash
curl http://localhost:3000/logistica/kpis/tiempo-despacho
```

## 🏗️ Arquitectura de Capas

### Presentation (Controladores + DTOs)
- Validan y transforman datos de entrada
- Llaman a servicios de aplicación
- Devuelven respuestas HTTP

### Application (Servicios)
- Contienen lógica de negocio
- Interactúan con Prisma para acceso a datos
- Manejan excepciones y validaciones de negocio

### Infrastructure (Prisma Service)
- Conexión centralizada con la base de datos
- Gestión del lifecycle (OnModuleInit, OnModuleDestroy)

## 🔑 Validaciones Implementadas

### DTOs
- `id_direccion`: Entero positivo obligatorio
- `direccion`: String no vacío obligatorio
- `id_cliente`: Entero obligatorio
- `id_transportista`: Entero obligatorio
- `nombre_transp`: String no vacío obligatorio
- `patente_vehiculo`: String de 6-8 caracteres (patentes chilenas)
- `id_empleado`: Entero positivo obligatorio
- `id_ot`: Entero positivo obligatorio
- `estado`: Solo acepta ['Pendiente', 'En Proceso', 'Completado']

## 🔗 Integraciones

### Con RRHH
- Transportistas se vinculan con empleados de RRHH via `id_empleado`
- Pickings se asignan a empleados de RRHH
- Los datos del empleado se incluyen en las respuestas (include)

### Integridad Referencial
- Foreign Keys garantizadas por la base de datos
- Validaciones desde aplicación para mejor UX

## 📊 KPIs Disponibles

1. **Productividad por Empleado**
   - Cuenta pickings completados por empleado
   - Útil para bonificación y evaluación

2. **Tiempo Medio de Despacho**
   - Calcula promedio de horas entre picking y guía
   - Identifica cuellos de botella

## ⚙️ Configuración del Módulo

El módulo se registra automáticamente en `src/app.module.ts`:

```typescript
@Module({
  imports: [RrhhModule, LogisticaModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
