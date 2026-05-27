"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/erp-store"
import {
  createPurchaseOrder,
  getPurchaseOrderSuppliers,
} from "@/lib/purchase-orders"
import type { PurchaseOrderSupplier } from "@/lib/purchase-orders"

interface FormItem {
  id: string
  productName: string
  quantity: string
  unitPrice: string
}

type FormErrors = Partial<
  Record<"supplierId" | "createdAt" | "items" | "submit", string>
>

type ItemErrors = Partial<Record<"productName" | "quantity" | "unitPrice", string>>

const currentUserId = "USR-001"

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

function createEmptyItem(id = "item-1"): FormItem {
  return {
    id,
    productName: "",
    quantity: "1",
    unitPrice: "",
  }
}

function parseAmount(value: string) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<PurchaseOrderSupplier[]>([])
  const [supplierId, setSupplierId] = useState("")
  const [createdAt, setCreatedAt] = useState(getTodayInputValue())
  const [items, setItems] = useState<FormItem[]>([createEmptyItem()])
  const [errors, setErrors] = useState<FormErrors>({})
  const [itemErrors, setItemErrors] = useState<Record<string, ItemErrors>>({})
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadSuppliers() {
      setIsLoadingSuppliers(true)
      const data = await getPurchaseOrderSuppliers()

      if (isMounted) {
        setSuppliers(data.filter((supplier) => supplier.active))
        setIsLoadingSuppliers(false)
      }
    }

    loadSuppliers()

    return () => {
      isMounted = false
    }
  }, [])

  const total = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + parseAmount(item.quantity) * parseAmount(item.unitPrice),
        0,
      ),
    [items],
  )

  const updateItem = (
    id: string,
    field: keyof Omit<FormItem, "id">,
    value: string,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    )
  }

  const addItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      createEmptyItem(`item-${Date.now()}`),
    ])
  }

  const removeItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.length === 1
        ? currentItems
        : currentItems.filter((item) => item.id !== id),
    )
  }

  const resetForm = () => {
    setSupplierId("")
    setCreatedAt(getTodayInputValue())
    setItems([createEmptyItem()])
    setErrors({})
    setItemErrors({})
  }

  const validateForm = () => {
    const nextErrors: FormErrors = {}
    const nextItemErrors: Record<string, ItemErrors> = {}

    if (!supplierId) {
      nextErrors.supplierId = "Seleccione un proveedor"
    }

    if (!createdAt) {
      nextErrors.createdAt = "Seleccione una fecha"
    }

    items.forEach((item) => {
      const rowErrors: ItemErrors = {}
      const quantity = parseAmount(item.quantity)
      const unitPrice = parseAmount(item.unitPrice)

      if (!item.productName.trim()) {
        rowErrors.productName = "Ingrese un producto"
      }

      if (quantity <= 0) {
        rowErrors.quantity = "Cantidad invalida"
      }

      if (unitPrice <= 0) {
        rowErrors.unitPrice = "Precio invalido"
      }

      if (Object.keys(rowErrors).length > 0) {
        nextItemErrors[item.id] = rowErrors
      }
    })

    if (Object.keys(nextItemErrors).length > 0) {
      nextErrors.items = "Revise los items de la orden"
    }

    setErrors(nextErrors)
    setItemErrors(nextItemErrors)

    return (
      Object.keys(nextErrors).length === 0 &&
      Object.keys(nextItemErrors).length === 0
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const createdOrder = await createPurchaseOrder({
        supplierId,
        createdAt,
        userId: currentUserId,
        items: items.map((item) => ({
          productName: item.productName.trim(),
          quantity: parseAmount(item.quantity),
          unitPrice: parseAmount(item.unitPrice),
        })),
      })

      setCreatedOrderId(createdOrder.id)
      setShowSuccessDialog(true)
      resetForm()
    } catch {
      setErrors({
        submit: "No fue posible crear la orden. Intente nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Nueva Orden de Compra"
        description="Registra una orden de compra con items y total automatico"
        actions={
          <Button variant="outline" asChild>
            <Link href="/compras/ordenes">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
        }
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="supplier" className="mb-2 block">
                Proveedor
              </Label>
              <Select
                value={supplierId}
                onValueChange={setSupplierId}
                disabled={isLoadingSuppliers}
              >
                <SelectTrigger
                  id="supplier"
                  className="w-full"
                  aria-invalid={Boolean(errors.supplierId)}
                >
                  <SelectValue
                    placeholder={
                      isLoadingSuppliers
                        ? "Cargando proveedores..."
                        : "Seleccione un proveedor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.rut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.supplierId}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="createdAt" className="mb-2 block">
                Fecha de creacion
              </Label>
              <Input
                id="createdAt"
                type="date"
                value={createdAt}
                onChange={(event) => setCreatedAt(event.target.value)}
                aria-invalid={Boolean(errors.createdAt)}
              />
              {errors.createdAt && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.createdAt}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Items de la orden
              </h2>
              {errors.items && (
                <p className="mt-1 text-sm text-destructive">{errors.items}</p>
              )}
            </div>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4" />
              Agregar Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const subtotal =
                parseAmount(item.quantity) * parseAmount(item.unitPrice)
              const rowErrors = itemErrors[item.id] ?? {}

              return (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-md border border-border bg-background p-3 lg:grid-cols-[minmax(220px,1fr)_130px_150px_150px_40px]"
                >
                  <div>
                    <Label htmlFor={`${item.id}-product`} className="mb-2 block">
                      Producto
                    </Label>
                    <Input
                      id={`${item.id}-product`}
                      placeholder={`Producto ${index + 1}`}
                      value={item.productName}
                      onChange={(event) =>
                        updateItem(item.id, "productName", event.target.value)
                      }
                      aria-invalid={Boolean(rowErrors.productName)}
                    />
                    {rowErrors.productName && (
                      <p className="mt-1 text-xs text-destructive">
                        {rowErrors.productName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor={`${item.id}-quantity`}
                      className="mb-2 block"
                    >
                      Cantidad
                    </Label>
                    <Input
                      id={`${item.id}-quantity`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.id, "quantity", event.target.value)
                      }
                      aria-invalid={Boolean(rowErrors.quantity)}
                    />
                    {rowErrors.quantity && (
                      <p className="mt-1 text-xs text-destructive">
                        {rowErrors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`${item.id}-price`} className="mb-2 block">
                      Precio unitario
                    </Label>
                    <Input
                      id={`${item.id}-price`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.unitPrice}
                      onChange={(event) =>
                        updateItem(item.id, "unitPrice", event.target.value)
                      }
                      aria-invalid={Boolean(rowErrors.unitPrice)}
                    />
                    {rowErrors.unitPrice && (
                      <p className="mt-1 text-xs text-destructive">
                        {rowErrors.unitPrice}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block">Subtotal</Label>
                    <div className="flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium">
                      {formatCurrency(subtotal)}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Eliminar item"
                      aria-label="Eliminar item"
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total orden</p>
            <p className="text-2xl font-semibold text-primary">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href="/compras/ordenes">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Crear Orden
            </Button>
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-destructive">{errors.submit}</p>
        )}
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Orden creada</DialogTitle>
            <DialogDescription className="text-center">
              La orden {createdOrderId} fue registrada correctamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/compras/ordenes")
              }}
            >
              Ver listado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
