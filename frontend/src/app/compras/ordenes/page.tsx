"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/erp-store"
import type {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/lib/purchase-orders"
import { getPurchaseOrders } from "@/lib/purchase-orders"

const statusOptions = ["Todos", "Pendiente", "Aprobada", "Cancelada"] as const
type StatusFilter = (typeof statusOptions)[number]

const statusBadgeClasses: Record<PurchaseOrderStatus, string> = {
  Pendiente: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  Aprobada: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Cancelada: "border-red-500/30 bg-red-500/10 text-red-300",
}

function StatusBadge({ status }: { status: PurchaseOrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  )
}

function formatLocalDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number)
  return formatDate(new Date(year, month - 1, day))
}

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setIsLoading(true)
      const data = await getPurchaseOrders()

      if (isMounted) {
        setOrders(data)
        setIsLoading(false)
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.supplierId.toLowerCase().includes(normalizedSearch) ||
        order.supplierName.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === "Todos" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  const filteredTotal = filteredOrders.reduce(
    (acc, order) => acc + order.total,
    0,
  )

  return (
    <DashboardLayout>
      <PageHeader
        title="Ordenes de Compra"
        description="Consulta y filtra las ordenes de compra registradas"
        actions={
          <Button asChild>
            <Link href="/compras/ordenes/nueva">
              <Plus className="h-4 w-4" />
              Nueva Orden
            </Link>
          </Button>
        }
      />

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="ID de orden, proveedor o ID proveedor"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Estado
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border bg-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Total filtrado</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(filteredTotal)}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Cargando ordenes de compra...
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "id", header: "ID Orden" },
            { key: "supplierId", header: "ID Proveedor" },
            { key: "supplierName", header: "Proveedor" },
            {
              key: "createdAt",
              header: "Fecha",
              render: (item) => formatLocalDate(item.createdAt),
            },
            {
              key: "status",
              header: "Estado",
              render: (item) => <StatusBadge status={item.status} />,
            },
            {
              key: "total",
              header: "Total",
              className: "text-right",
              render: (item) => (
                <span className="font-medium">{formatCurrency(item.total)}</span>
              ),
            },
            { key: "userId", header: "ID Usuario" },
          ]}
          data={filteredOrders}
          emptyMessage="No se encontraron ordenes de compra"
        />
      )}
    </DashboardLayout>
  )
}
