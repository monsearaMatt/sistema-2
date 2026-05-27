// Mock data store for ERP system
// In a real application, this would connect to a database

export interface Proveedor {
  id: string
  nombre: string
  rut: string
  email: string
  contacto: string
  activo: boolean
  createdAt: Date
}

export interface Producto {
  id: string
  codigo: string
  nombre: string
  unidadMedida: string
  precio: number
  stockActual: number
  stockMinimo: number
  activo: boolean
}

export interface OrdenCompraItem {
  productoId: string
  producto: Producto
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface OrdenCompra {
  id: string
  proveedorId: string
  proveedor: Proveedor
  items: OrdenCompraItem[]
  total: number
  estado: "pendiente" | "recibida" | "anulada"
  fecha: Date
  createdAt: Date
}

export interface Movimiento {
  id: string
  productoId: string
  producto: Producto
  tipo: "entrada" | "salida" | "reserva"
  cantidad: number
  ordenCompraId?: string
  motivo?: string
  fecha: Date
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "comprador" | "jefe_bodega" | "administrador"
  empleadoId?: string
  activo: boolean
}

// Initial mock data
export const proveedores: Proveedor[] = [
  {
    id: "1",
    nombre: "Distribuidora ABC",
    rut: "12.345.678-9",
    email: "contacto@abc.com",
    contacto: "+56 9 1234 5678",
    activo: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nombre: "Suministros XYZ",
    rut: "98.765.432-1",
    email: "ventas@xyz.com",
    contacto: "+56 9 8765 4321",
    activo: true,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    nombre: "Importadora Global",
    rut: "11.222.333-4",
    email: "info@global.com",
    contacto: "+56 9 1122 3344",
    activo: false,
    createdAt: new Date("2024-03-10"),
  },
]

export const productos: Producto[] = [
  {
    id: "1",
    codigo: "PROD-001",
    nombre: "Papel Carta Resma 500 hojas",
    unidadMedida: "Unidad",
    precio: 4500,
    stockActual: 150,
    stockMinimo: 50,
    activo: true,
  },
  {
    id: "2",
    codigo: "PROD-002",
    nombre: "Tinta Impresora Negro HP",
    unidadMedida: "Unidad",
    precio: 25000,
    stockActual: 8,
    stockMinimo: 10,
    activo: true,
  },
  {
    id: "3",
    codigo: "PROD-003",
    nombre: "Clips Metálicos Caja x100",
    unidadMedida: "Caja",
    precio: 1200,
    stockActual: 45,
    stockMinimo: 20,
    activo: true,
  },
  {
    id: "4",
    codigo: "PROD-004",
    nombre: "Carpeta Archivador Oficio",
    unidadMedida: "Unidad",
    precio: 3500,
    stockActual: 5,
    stockMinimo: 15,
    activo: true,
  },
  {
    id: "5",
    codigo: "PROD-005",
    nombre: "Cinta Adhesiva Transparente",
    unidadMedida: "Unidad",
    precio: 800,
    stockActual: 120,
    stockMinimo: 30,
    activo: true,
  },
  {
    id: "6",
    codigo: "PROD-006",
    nombre: "Marcador Permanente Negro",
    unidadMedida: "Unidad",
    precio: 1500,
    stockActual: 3,
    stockMinimo: 25,
    activo: true,
  },
]

export const ordenesCompra: OrdenCompra[] = [
  {
    id: "OC-001",
    proveedorId: "1",
    proveedor: proveedores[0],
    items: [
      {
        productoId: "1",
        producto: productos[0],
        cantidad: 100,
        precioUnitario: 4500,
        subtotal: 450000,
      },
      {
        productoId: "3",
        producto: productos[2],
        cantidad: 50,
        precioUnitario: 1200,
        subtotal: 60000,
      },
    ],
    total: 510000,
    estado: "recibida",
    fecha: new Date("2024-03-01"),
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "OC-002",
    proveedorId: "2",
    proveedor: proveedores[1],
    items: [
      {
        productoId: "2",
        producto: productos[1],
        cantidad: 20,
        precioUnitario: 25000,
        subtotal: 500000,
      },
    ],
    total: 500000,
    estado: "pendiente",
    fecha: new Date("2024-03-15"),
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "OC-003",
    proveedorId: "1",
    proveedor: proveedores[0],
    items: [
      {
        productoId: "4",
        producto: productos[3],
        cantidad: 30,
        precioUnitario: 3500,
        subtotal: 105000,
      },
      {
        productoId: "5",
        producto: productos[4],
        cantidad: 100,
        precioUnitario: 800,
        subtotal: 80000,
      },
    ],
    total: 185000,
    estado: "pendiente",
    fecha: new Date("2024-03-18"),
    createdAt: new Date("2024-03-18"),
  },
  {
    id: "OC-004",
    proveedorId: "3",
    proveedor: proveedores[2],
    items: [
      {
        productoId: "6",
        producto: productos[5],
        cantidad: 50,
        precioUnitario: 1500,
        subtotal: 75000,
      },
    ],
    total: 75000,
    estado: "anulada",
    fecha: new Date("2024-02-28"),
    createdAt: new Date("2024-02-28"),
  },
]

export const movimientos: Movimiento[] = [
  {
    id: "MOV-001",
    productoId: "1",
    producto: productos[0],
    tipo: "entrada",
    cantidad: 100,
    ordenCompraId: "OC-001",
    fecha: new Date("2024-03-05"),
  },
  {
    id: "MOV-002",
    productoId: "3",
    producto: productos[2],
    tipo: "entrada",
    cantidad: 50,
    ordenCompraId: "OC-001",
    fecha: new Date("2024-03-05"),
  },
  {
    id: "MOV-003",
    productoId: "1",
    producto: productos[0],
    tipo: "salida",
    cantidad: 20,
    motivo: "Entrega a departamento de Ventas",
    fecha: new Date("2024-03-10"),
  },
  {
    id: "MOV-004",
    productoId: "2",
    producto: productos[1],
    tipo: "reserva",
    cantidad: 5,
    motivo: "Reserva para impresoras nuevas",
    fecha: new Date("2024-03-12"),
  },
]

export const usuarios: Usuario[] = [
  {
    id: "1",
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@erp.edu",
    rol: "administrador",
    activo: true,
  },
  {
    id: "2",
    nombre: "María González",
    email: "maria.gonzalez@erp.edu",
    rol: "comprador",
    activo: true,
  },
  {
    id: "3",
    nombre: "Pedro Silva",
    email: "pedro.silva@erp.edu",
    rol: "jefe_bodega",
    activo: true,
  },
  {
    id: "4",
    nombre: "Ana Torres",
    email: "ana.torres@erp.edu",
    rol: "comprador",
    activo: false,
  },
]

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function generateId(prefix: string): string {
  return `${prefix}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
}
