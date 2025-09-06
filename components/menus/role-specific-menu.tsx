"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { adminMenuItems, employeeMenuItems, superAdminMenuItems, type MenuItemProps } from "@/constants/menu-constants"

interface MenuSection {
  title: string
  description: string
  items: MenuItemProps[]
}

export function RoleSpecificMenu() {
  const { data: session } = useSession()
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

  const getMenuSections = (role: string): MenuSection[] => {
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
        menuItems = superAdminMenuItems
        break
      default:
        menuItems = []
    }

    const filteredItems = menuItems.filter((item) => item.allowedRoles.includes(normalizedRole))

    // Group items into sections
    const sections: MenuSection[] = []

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
    // Fixed: Check if item has submenu AND has subMenuItems with length > 0
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
        <Link href={item.menuItemLink || "#"}>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Menu</h2>
          <p className="text-muted-foreground">Access your tools and features based on your role</p>
        </div>
        <Badge
          variant={
            session.user.role.toUpperCase() === "SUPER_ADMIN"
              ? "destructive"
              : session.user.role.toUpperCase() === "ADMIN"
                ? "default"
                : "secondary"
          }
        >
          {session.user.role.replace("_", " ").toUpperCase()}
        </Badge>
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

      {/* Quick Stats */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {menuSections.reduce((acc, section) => acc + section.items.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{menuSections.length}</div>
              <div className="text-xs text-muted-foreground">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {menuSections.filter((section) => openSections[section.title] ?? true).length}
              </div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {menuSections.filter((section) => !(openSections[section.title] ?? true)).length}
              </div>
              <div className="text-xs text-muted-foreground">Collapsed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
