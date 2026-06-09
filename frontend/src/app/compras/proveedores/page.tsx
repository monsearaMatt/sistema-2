"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  proveedores,
  formatDate,
  generateId,
  type Proveedor,
} from "@/lib/erp-store";
import { Plus, Search, Edit, Power, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProveedoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null,
  );
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    email: "",
    contacto: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rut.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({ nombre: "", rut: "", email: "", contacto: "" });
    setErrors({});
    setEditingProveedor(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowFormDialog(true);
  };

  const openEditDialog = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      rut: proveedor.rut,
      email: proveedor.email,
      contacto: proveedor.contacto,
    });
    setShowFormDialog(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!formData.rut.trim()) {
      newErrors.rut = "El RUT es obligatorio";
    } else {
      // Check for duplicate RUT (except when editing the same supplier)
      const existingRut = proveedores.find(
        (p) => p.rut === formData.rut && p.id !== editingProveedor?.id,
      );
      if (existingRut) {
        newErrors.rut = "Ya existe un proveedor con este RUT";
      }
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingrese un email válido";
    }
    if (!formData.contacto.trim()) {
      newErrors.contacto = "El contacto es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingProveedor) {
      console.log("[v0] Updating supplier:", {
        ...editingProveedor,
        ...formData,
      });
    } else {
      console.log("[v0] Creating supplier:", {
        id: generateId("PROV"),
        ...formData,
        activo: true,
      });
    }

    setShowFormDialog(false);
    setShowSuccessDialog(true);
  };

  const handleToggleStatus = (proveedor: Proveedor) => {
    console.log(
      "[v0] Toggling supplier status:",
      proveedor.id,
      !proveedor.activo,
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Gestión de Proveedores"
        description="Administra los proveedores del sistema"
        actions={
          <Button variant={"default"} onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: "nombre", header: "Nombre" },
          { key: "rut", header: "RUT" },
          { key: "email", header: "Email" },
          { key: "contacto", header: "Contacto" },
          {
            key: "createdAt",
            header: "Fecha Registro",
            render: (item) => formatDate(item.createdAt),
          },

          {
            key: "acciones",
            header: "Acciones",
            render: (item) => (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(item);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredProveedores}
        emptyMessage="No se encontraron proveedores"
      />

      {/* Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription>
              {editingProveedor
                ? "Modifica los datos del proveedor"
                : "Ingresa los datos del nuevo proveedor"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">
                Nombre <span className="text-danger">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className={errors.nombre ? "border-danger" : ""}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-danger">{errors.nombre}</p>
              )}
            </div>
            <div>
              <Label htmlFor="rut">
                RUT <span className="text-danger">*</span>
              </Label>
              <Input
                id="rut"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
                }
                className={errors.rut ? "border-danger" : ""}
              />
              {errors.rut && (
                <p className="mt-1 text-sm text-danger">{errors.rut}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-danger" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contacto">
                Contacto <span className="text-danger">*</span>
              </Label>
              <Input
                id="contacto"
                placeholder="+56 9 1234 5678"
                value={formData.contacto}
                onChange={(e) =>
                  setFormData({ ...formData, contacto: e.target.value })
                }
                className={errors.contacto ? "border-danger" : ""}
              />
              {errors.contacto && (
                <p className="mt-1 text-sm text-danger">{errors.contacto}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingProveedor ? "Guardar Cambios" : "Crear Proveedor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <DialogTitle className="text-center">
              {editingProveedor ? "Proveedor Actualizado" : "Proveedor Creado"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {editingProveedor
                ? "Los datos del proveedor han sido actualizados exitosamente."
                : "El nuevo proveedor ha sido registrado exitosamente."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                resetForm();
              }}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
