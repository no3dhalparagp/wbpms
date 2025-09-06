"use client"

import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { adminMenuItems, employeeMenuItems, superAdminMenuItems, type MenuItemProps } from "@/constants/menu-constants"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!session?.user) return null

  const getNavigationByRole = (role: string): MenuItemProps[] => {
    const normalizedRole = role.toUpperCase() as "ADMIN" | "STAFF" | "SUPER_ADMIN"
    let menuItems: MenuItemProps[] = []

    // Get menu items based on role
    switch (normalizedRole) {
      case "ADMIN":
        menuItems = adminMenuItems
        break
      case "STAFF":
        menuItems = employeeMenuItems
        break
      case "SUPER_ADMIN":
        menuItems = [...adminMenuItems, ...superAdminMenuItems]
        break
      default:
        menuItems = []
    }

    const filteredItems = menuItems.filter((item) => item.allowedRoles.includes(normalizedRole)).slice(0, 8) // Limit to main items for sidebar

    return filteredItems
  }

  const navigation = getNavigationByRole(session.user.role)

  const renderSidebarItem = (item: MenuItemProps) => {
    return (
      <div key={item.menuItemText} className="group">
        <Button asChild variant="ghost" className="w-full justify-start h-auto p-3" disabled={!item.menuItemLink}>
          <Link href={item.menuItemLink || "#"}>
            <div className="flex items-start space-x-3">
              {item.Icon && <item.Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${item.color || ""}`} />}
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{item.menuItemText}</div>
                {item.submenu && <div className="text-xs text-muted-foreground">{item.subMenuItems.length} items</div>}
              </div>
            </div>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">GP Management</h1>
            <p className="text-xs text-muted-foreground">{session.user.gramPanchayat?.name || "System"}</p>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  session.user.role.toUpperCase() === "SUPER_ADMIN"
                    ? "bg-red-500"
                    : session.user.role.toUpperCase() === "ADMIN"
                      ? "bg-blue-500"
                      : "bg-green-500"
                }`}
              />
              <span className="text-sm font-medium">{session.user.role.replace("_", " ")} Access</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{session.user.name}</p>
          </div>

          <nav className="space-y-1">{navigation.map((item) => renderSidebarItem(item))}</nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>

            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{session.user.role.replace("_", " ")}</span>
              {session.user.gramPanchayat && (
                <>
                  <span>•</span>
                  <span>{session.user.gramPanchayat.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            

          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
