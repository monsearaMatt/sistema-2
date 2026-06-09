# Guia de Estilos - ERP Web Mockups

## Paleta de Colores (Tailwind CSS)

### Colores Base

| Uso | Clase Tailwind | Color |
|-----|----------------|-------|
| Fondo principal | `bg-background` | Gris muy oscuro azulado |
| Texto principal | `text-foreground` | Blanco/gris claro |
| Cards/Paneles | `bg-card` | Gris oscuro elevado |
| Bordes | `border-border` | Gris sutil |

### Colores de Accion

| Uso | Clase Tailwind | Color |
|-----|----------------|-------|
| Primario (botones, acentos) | `bg-primary` / `text-primary` | Verde/Teal |
| Secundario | `bg-secondary` | Gris oscuro medio |
| Hover/Accent | `bg-accent` | Gris claro hover |

### Colores Semanticos (Estados)

| Estado | Clase Tailwind | Color |
|--------|----------------|-------|
| Exito/Positivo | `text-green-500` | Verde |
| Advertencia | `text-yellow-500` | Amarillo/Dorado |
| Error/Peligro | `text-red-500` | Rojo |
| Info | `text-blue-500` | Azul |
| Texto apagado | `text-muted-foreground` | Gris claro |

---

## Tipografia

```
Fuente principal: Inter / Geist (font-sans)
Fuente monoespaciada: Geist Mono (font-mono)
```

| Uso | Clases |
|-----|--------|
| Titulos grandes | `text-2xl font-bold` o `text-3xl font-bold` |
| Titulos de seccion | `text-lg font-semibold` |
| Texto normal | `text-sm` o `text-base` |
| Texto pequeno/labels | `text-xs` |
| Texto apagado | `text-muted-foreground` |

---

## Botones

```tsx
// Boton Primario (accion principal)
<Button>Guardar</Button>
// o manualmente:
className="bg-primary text-primary-foreground"

// Boton Secundario
<Button variant="secondary">Cancelar</Button>

// Boton Ghost (sin fondo)
<Button variant="ghost">Opciones</Button>

// Boton Destructivo (eliminar)
<Button variant="destructive">Eliminar</Button>

// Boton Outline
<Button variant="outline">Ver mas</Button>
```

---

## Cards y Contenedores

```tsx
// Card basica
className="rounded-lg border border-border bg-card p-4"

// Card con hover
className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"

// Contenedor de seccion
className="space-y-4"
```

---

## Bordes y Radios

| Tamano | Clase | Uso |
|--------|-------|-----|
| Pequeno | `rounded-sm` | Badges, chips |
| Medio | `rounded-md` | Inputs, botones |
| Grande | `rounded-lg` | Cards, modales |
| Extra grande | `rounded-xl` | Contenedores principales |

---

## Sidebar

```tsx
// Fondo sidebar (mas oscuro)
className="bg-sidebar"

// Item activo en sidebar
className="bg-sidebar-accent text-sidebar-accent-foreground"

// Item hover
className="hover:bg-sidebar-accent"
```

---

## Espaciado Comun

| Uso | Clase |
|-----|-------|
| Padding card | `p-4` o `p-6` |
| Gap entre elementos | `gap-2` o `gap-4` |
| Margen entre secciones | `space-y-4` o `space-y-6` |
| Padding pagina | `p-4 md:p-6` |

---

## Tablas

```tsx
// Encabezado de tabla
className="text-xs font-medium text-muted-foreground uppercase"

// Fila de tabla
className="border-b border-border hover:bg-muted/50"

// Celda con valor positivo
className="text-green-500 font-medium"

// Celda con valor negativo
className="text-red-500 font-medium"
```

---

## Graficos (Chart Colors)

| Variable | Uso |
|----------|-----|
| `--chart-1` | Datos principales (verde/teal) |
| `--chart-2` | Datos secundarios (azul) |
| `--chart-3` | Tendencias (amarillo) |
| `--chart-4` | Alertas (rojo) |
| `--chart-5` | Categorias extra (purpura) |

---

## Ejemplos de Uso

### Texto con estados

```tsx
// Valor positivo (ej: ganancia)
<span className="text-green-500 font-medium">+$1,234.56</span>

// Valor negativo (ej: perdida)
<span className="text-red-500 font-medium">-$567.89</span>

// Texto secundario
<span className="text-muted-foreground text-sm">Descripcion</span>
```

### Card tipica

```tsx
<div className="rounded-lg border border-border bg-card p-4">
  <h3 className="text-lg font-semibold text-foreground">Titulo</h3>
  <p className="text-sm text-muted-foreground">Subtitulo o descripcion</p>
  <div className="mt-4">
    {/* Contenido */}
  </div>
</div>
```

### Input con label

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Nombre</label>
  <Input placeholder="Ingrese nombre" />
</div>
```

---

## Notas Importantes

1. **Siempre usar tokens semanticos** (`bg-background`, `text-foreground`, etc.) en lugar de colores directos (`bg-gray-900`)
2. **Tema oscuro por defecto** - todo el diseno esta pensado para modo oscuro
3. **Fuente Inter/Geist** - aplicada via `font-sans`
4. **Iconos**: Usar Lucide React (`lucide-react`)

---

## Componentes de shadcn/ui Disponibles

- `Button` - Botones con variantes
- `Card` - Contenedores con CardHeader, CardTitle, CardDescription, CardContent
- `Input` - Campos de texto
- `Select` - Selectores desplegables
- `Table` - Tablas con TableHeader, TableBody, TableRow, TableCell
- `Badge` - Etiquetas/chips
- `Avatar` - Imagenes de perfil
- `DropdownMenu` - Menus contextuales
- `Tabs` - Navegacion por pestanas
- `Dialog` - Modales
- `Sheet` - Paneles laterales