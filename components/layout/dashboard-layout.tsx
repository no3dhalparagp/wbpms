"use client"

import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { Menu, X, ChevronRight, ChevronDown, Home, Settings, User, Bell, LogOut } from "lucide-react"
import { useState } from "react"
import { adminMenuItems, employeeMenuItems, superAdminMenuItems, type MenuItemProps } from "@/constants/menu-constants"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [openMenuItems, setOpenMenuItems] = useState<Record<string, boolean>>({})

  if (!session?.user) return null

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }))
  }

  const toggleMenuItem = (key: string) => {
    setOpenMenuItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getMenuSections = (role: string): {title: string, description: string, items: MenuItemProps[]}[] => {
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

    const filteredItems = menuItems.filter((item) => item.allowedRoles.includes(normalizedRole))

    // Group items into sections
    const sections: {title: string, description: string, items: MenuItemProps[]}[] = []

    // Dashboard section
    const dashboardItems = filteredItems.filter((item) => item.menuItemText.toLowerCase().includes("dashboard"))
    if (dashboardItems.length > 0) {
      sections.push({
        title: "Dashboard",
        description: "Overview and quick access",
        items: dashboardItems,
      })
    }

    // Certificate Management section
    const certificateItems = filteredItems.filter((item) => item.menuItemText.toLowerCase().includes("certificate"))
    if (certificateItems.length > 0) {
      sections.push({
        title: "Certificate Management",
        description: "Certificate processing and management tools",
        items: certificateItems,
      })
    }

    // Operations section
    const operationItems = filteredItems.filter(
      (item) =>
        item.menuItemText.toLowerCase().includes("operation") ||
        item.menuItemText.toLowerCase().includes("work") ||
        item.menuItemText.toLowerCase().includes("meeting"),
    )
    if (operationItems.length > 0) {
      sections.push({
        title: "Operations",
        description: "Work management and operational tools",
        items: operationItems,
      })
    }

    // Financial section
    const financialItems = filteredItems.filter(
      (item) =>
        item.menuItemText.toLowerCase().includes("financial") ||
        item.menuItemText.toLowerCase().includes("payment") ||
        item.menuItemText.toLowerCase().includes("procurement"),
    )
    if (financialItems.length > 0) {
      sections.push({
        title: "Financial Management",
        description: "Financial services and procurement tools",
        items: financialItems,
      })
    }

    // Administration section
    const adminItems = filteredItems.filter(
      (item) =>
        item.menuItemText.toLowerCase().includes("system") ||
        item.menuItemText.toLowerCase().includes("user") ||
        item.menuItemText.toLowerCase().includes("vendor") ||
        item.menuItemText.toLowerCase().includes("village"),
    )
    if (adminItems.length > 0) {
      sections.push({
        title: "Administration",
        description: "System administration and user management",
        items: adminItems,
      })
    }

    // Other items
    const otherItems = filteredItems.filter(
      (item) =>
        !dashboardItems.includes(item) &&
        !certificateItems.includes(item) &&
        !operationItems.includes(item) &&
        !financialItems.includes(item) &&
        !adminItems.includes(item),
    )
    if (otherItems.length > 0) {
      sections.push({
        title: "Other Services",
        description: "Additional tools and resources",
        items: otherItems,
      })
    }

    return sections
  }

  const renderMenuItem = (item: MenuItemProps, depth = 0, parentPath = '') => {
    const hasSubmenu = item.submenu && item.subMenuItems && item.subMenuItems.length > 0;
    const paddingLeft = depth * 16
    const itemKey = `${parentPath}-${item.menuItemText}`

    if (hasSubmenu) {
      return (
        <Collapsible
          key={itemKey}
          open={openMenuItems[itemKey]}
          onOpenChange={() => toggleMenuItem(itemKey)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-2 text-left"
              style={{ paddingLeft: `${paddingLeft + 8}px` }}
            >
              <div className="flex items-center space-x-2">
                {item.Icon && <item.Icon className="h-4 w-4" />}
                <span className="text-sm">{item.menuItemText}</span>
              </div>
              {openMenuItems[itemKey] ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.subMenuItems.map((subItem) => 
              renderMenuItem(subItem, depth + 1, itemKey)
            )}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Button
        key={itemKey}
        asChild
        variant="ghost"
        className="w-full justify-start h-auto p-2"
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
      >
        <Link href={item.menuItemLink || "#"} onClick={() => setSidebarOpen(false)}>
          <div className="flex items-center space-x-2">
            {item.Icon && <item.Icon className={`h-4 w-4 ${item.color || ""}`} />}
            <span className="text-sm">{item.menuItemText}</span>
          </div>
        </Link>
      </Button>
    )
  }

  const menuSections = getMenuSections(session.user.role)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
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

        <div className="flex-1 overflow-y-auto p-4">
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

          {/* Menu Sections */}
          <div className="space-y-3">
            {menuSections.map((section, index) => {
              const isOpen = openSections[section.title] ?? true

              return (
                <Collapsible key={index} open={isOpen} onOpenChange={() => toggleSection(section.title)}>
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full h-auto p-4 justify-between hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-lg font-semibold text-left">{section.title}</h3>
                            <p className="text-sm text-muted-foreground text-left">{section.description}</p>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <div className="space-y-1">{section.items.map((item) => renderMenuItem(item))}</div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-30">
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
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {session.user.name?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.role.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
