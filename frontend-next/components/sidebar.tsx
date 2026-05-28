"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ShoppingCart,
  Package,
  Users,
  LayoutDashboard,
  FileText,
  Truck,
  History,
  PackagePlus,
  PackageMinus,
  Settings,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "COMPRAS",
    items: [
      {
        title: "Órdenes de Compra",
        icon: FileText,
        children: [
          { title: "Nueva Orden", href: "/compras/ordenes/nueva" },
          { title: "Listado", href: "/compras/ordenes" },
        ],
      },
      {
        title: "Proveedores",
        icon: Truck,
        children: [
          { title: "Gestión", href: "/compras/proveedores" },
          { title: "Historial", href: "/compras/proveedores/historial" },
        ],
      },
    ],
  },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => pathname.startsWith(child.href)) ?? false
  )

  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((child) => pathname.startsWith(child.href))

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            {item.title}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-7 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        pathname === item.href
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShoppingCart className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-foreground">
              ERP System
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Compras e Inventario
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {navigation.map((group) => (
            <div key={group.section}>
              <h2 className="mb-2 px-3 text-xs font-semibold tracking-wider text-sidebar-foreground/50">
                {group.section}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItemComponent key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <Users className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">
                ACA IRIA EL USER
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                ACA IRIA EL CORREO
              </p>
            </div>
            <Settings className="h-4 w-4 text-sidebar-foreground/60" />
          </div>
        </div>
      </div>
    </aside>
  )
}
