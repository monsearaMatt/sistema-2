import api from "../src/api/axios"

export type PurchaseOrderStatus = "Pendiente" | "Aprobada" | "Cancelada"

export interface PurchaseOrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  createdAt: string
  status: PurchaseOrderStatus
  total: number
  userId: string
  userName: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderSupplier {
  id: string
  name: string
  rut: string
  active: boolean
}

interface CreatePurchaseOrderItemInput {
  productName: string
  quantity: number
  unitPrice: number
}

interface CreatePurchaseOrderInput {
  supplierId: string
  createdAt: string
  userId: string
  items: CreatePurchaseOrderItemInput[]
}

const mockSuppliers: PurchaseOrderSupplier[] = [
  {
    id: "PROV-001",
    name: "Distribuidora ABC",
    rut: "12.345.678-9",
    active: true,
  },
  {
    id: "PROV-002",
    name: "Suministros XYZ",
    rut: "98.765.432-1",
    active: true,
  },
  {
    id: "PROV-003",
    name: "Importadora Global",
    rut: "11.222.333-4",
    active: true,
  },
  {
    id: "PROV-004",
    name: "Servicios Industriales Sur",
    rut: "76.543.210-8",
    active: false,
  },
]

const mockUsers = [
  { id: "USR-001", name: "Carlos Mendoza" },
  { id: "USR-002", name: "Maria Gonzalez" },
  { id: "USR-003", name: "Pedro Silva" },
]

let mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "OC-0001",
    supplierId: "PROV-001",
    supplierName: "Distribuidora ABC",
    createdAt: "2026-05-02",
    status: "Pendiente",
    total: 510000,
    userId: "USR-002",
    userName: "Maria Gonzalez",
    items: [
      {
        id: "OCI-001",
        productName: "Papel carta resma 500 hojas",
        quantity: 100,
        unitPrice: 4500,
        subtotal: 450000,
      },
      {
        id: "OCI-002",
        productName: "Clips metalicos caja x100",
        quantity: 50,
        unitPrice: 1200,
        subtotal: 60000,
      },
    ],
  },
  {
    id: "OC-0002",
    supplierId: "PROV-002",
    supplierName: "Suministros XYZ",
    createdAt: "2026-05-04",
    status: "Aprobada",
    total: 500000,
    userId: "USR-001",
    userName: "Carlos Mendoza",
    items: [
      {
        id: "OCI-003",
        productName: "Tinta impresora negro HP",
        quantity: 20,
        unitPrice: 25000,
        subtotal: 500000,
      },
    ],
  },
  {
    id: "OC-0003",
    supplierId: "PROV-001",
    supplierName: "Distribuidora ABC",
    createdAt: "2026-05-07",
    status: "Pendiente",
    total: 185000,
    userId: "USR-003",
    userName: "Pedro Silva",
    items: [
      {
        id: "OCI-004",
        productName: "Carpeta archivador oficio",
        quantity: 30,
        unitPrice: 3500,
        subtotal: 105000,
      },
      {
        id: "OCI-005",
        productName: "Cinta adhesiva transparente",
        quantity: 100,
        unitPrice: 800,
        subtotal: 80000,
      },
    ],
  },
  {
    id: "OC-0004",
    supplierId: "PROV-003",
    supplierName: "Importadora Global",
    createdAt: "2026-05-09",
    status: "Cancelada",
    total: 75000,
    userId: "USR-002",
    userName: "Maria Gonzalez",
    items: [
      {
        id: "OCI-006",
        productName: "Marcador permanente negro",
        quantity: 50,
        unitPrice: 1500,
        subtotal: 75000,
      },
    ],
  },
  {
    id: "OC-0005",
    supplierId: "PROV-002",
    supplierName: "Suministros XYZ",
    createdAt: "2026-05-11",
    status: "Aprobada",
    total: 325000,
    userId: "USR-001",
    userName: "Carlos Mendoza",
    items: [
      {
        id: "OCI-007",
        productName: "Archivadores oficio lomo ancho",
        quantity: 65,
        unitPrice: 5000,
        subtotal: 325000,
      },
    ],
  },
]

function resolveAfterDelay<T>(data: T, timeout = 350): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), timeout)
  })
}

function clonePurchaseOrder(order: PurchaseOrder): PurchaseOrder {
  return {
    ...order,
    items: order.items.map((item) => ({ ...item })),
  }
}

function createOrderId() {
  return `OC-${String(mockPurchaseOrders.length + 1).padStart(4, "0")}`
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data } = await api.get('/logistica/compras/ordenes')
  return data.map((oc: any) => ({
    id: oc.id,
    supplierId: oc.id_proveedor,
    supplierName: oc.Proveedor?.nombre || 'Proveedor Desconocido',
    createdAt: oc.fecha_creacion ? oc.fecha_creacion.split('T')[0] : '',
    status: oc.estado === 'PENDIENTE' || oc.estado === 'PENDIENTE' ? 'Pendiente' : oc.estado === 'APROBADA' || oc.estado === 'Aprobada' ? 'Aprobada' : 'Cancelada',
    total: oc.total,
    userId: oc.id_usuario,
    userName: oc.id_usuario,
    items: (oc.Detalle_OC || []).map((det: any) => ({
      id: det.id_detalle,
      productName: det.nombre_producto,
      quantity: det.cantidad,
      unitPrice: det.precio_unitario,
      subtotal: det.cantidad * det.precio_unitario,
    }))
  }))
}

export async function getPurchaseOrderSuppliers(): Promise<
  PurchaseOrderSupplier[]
> {
  const { data } = await api.get('/logistica/maestros/proveedores')
  return data.map((prov: any) => ({
    id: prov.id,
    name: prov.nombre,
    rut: prov.rutEmpresa || prov.rut || '',
    active: true,
  }))
}

export async function createPurchaseOrder(
  input: CreatePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const { data: oc } = await api.post('/logistica/compras', {
    supplierId: input.supplierId,
    createdAt: input.createdAt,
    userId: input.userId,
    items: input.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  })

  return {
    id: oc.id,
    supplierId: oc.id_proveedor,
    supplierName: oc.Proveedor?.nombre || 'Proveedor',
    createdAt: oc.fecha_creacion ? oc.fecha_creacion.split('T')[0] : '',
    status: oc.estado === 'PENDIENTE' || oc.estado === 'PENDIENTE' ? 'Pendiente' : oc.estado === 'APROBADA' || oc.estado === 'Aprobada' ? 'Aprobada' : 'Cancelada',
    total: oc.total,
    userId: oc.id_usuario,
    userName: oc.id_usuario,
    items: (oc.Detalle_OC || []).map((det: any) => ({
      id: det.id_detalle,
      productName: det.nombre_producto,
      quantity: det.cantidad,
      unitPrice: det.precio_unitario,
      subtotal: det.cantidad * det.precio_unitario,
    }))
  }
}
