"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  proveedores,
  ordenesCompra,
  formatCurrency,
  formatDate,
} from "@/lib/erp-store"
import { FileText, TrendingUp } from "lucide-react"

export default function HistorialProveedorPage() {
  const [selectedProveedorId, setSelectedProveedorId] = useState("")

  const activeProveedores = proveedores.filter((p) => p.activo)

  const proveedorOrders = selectedProveedorId
    ? ordenesCompra.filter((oc) => oc.proveedorId === selectedProveedorId)
    : []

  const totalCompras = proveedorOrders.reduce((acc, oc) => acc + oc.total, 0)
  const ordenesRecibidas = proveedorOrders.filter(
    (oc) => oc.estado === "recibida"
  ).length

  const selectedProveedor = proveedores.find((p) => p.id === selectedProveedorId)

  return (
    <DashboardLayout>
      <PageHeader
        title="Historial por Proveedor"
        description="Consulta el historial de compras por proveedor"
      />

      {/* Supplier Selection */}
      <div className="mb-6 max-w-md">
        <Label htmlFor="proveedor" className="mb-2 block">
          Seleccionar Proveedor
        </Label>
        <Select value={selectedProveedorId} onValueChange={setSelectedProveedorId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {activeProveedores.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProveedorId && (
        <>
          {/* Supplier Info & Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Órdenes</p>
                  <p className="text-xl font-semibold">{proveedorOrders.length}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Órdenes Recibidas</p>
                  <p className="text-xl font-semibold">{ordenesRecibidas}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total en Compras
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalCompras)}
                  </p>
                </div>
                {selectedProveedor && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{selectedProveedor.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProveedor.rut}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Órdenes de Compra Realizadas
            </h2>
            <DataTable
              columns={[
                { key: "id", header: "ID Orden" },
                {
                  key: "fecha",
                  header: "Fecha",
                  render: (item) => formatDate(item.fecha),
                },
                {
                  key: "items",
                  header: "Productos",
                  render: (item) => `${item.items.length} items`,
                },
                {
                  key: "total",
                  header: "Total",
                  className: "text-right",
                  render: (item) => (
                    <span className="font-medium">
                      {formatCurrency(item.total)}
                    </span>
                  ),
                },
              ]}
              data={proveedorOrders}
              emptyMessage="Este proveedor no tiene órdenes registradas"
            />
          </div>
        </>
      )}

      {!selectedProveedorId && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium text-muted-foreground">
            Seleccione un Proveedor
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Elija un proveedor del listado para ver su historial de compras
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
