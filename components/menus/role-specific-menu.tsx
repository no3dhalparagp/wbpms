"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  User,
  CheckSquare,
  MapPin,
  Settings,
  UserCog,
  Building,
  FileText,
  Shield,
  Users,
  Globe,
  Cog,
  Activity,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface MenuSection {
  title: string
  description: string
  items: {
    name: string
    href: string
    icon: any
    description: string
    badge?: string
  }[]
}

export function RoleSpecificMenu() {
  const { data: session } = useSession()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  if (!session?.user) return null

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  const getMenuSections = (role: string): MenuSection[] => {
    const sections: MenuSection[] = []

    // Common sections for all roles
    sections.push({
      title: "Dashboard",
      description: "Overview and quick access",
      items: [
        {
          name: "Main Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          description: "System overview and statistics",
        },
      ],
    })

    // Staff-specific sections
    if (["STAFF", "ADMIN", "SUPER_ADMIN"].includes(role)) {
      sections.push({
        title: "My Workspace",
        description: "Personal tools and information",
        items: [
          {
            name: "My Profile",
            href: "/staff/profile",
            icon: User,
            description: "Personal information and settings",
          },
          {
            name: "My Tasks",
            href: "/staff/tasks",
            icon: CheckSquare,
            description: "Assigned tasks and activities",
            badge: "New",
          },
          {
            name: "GP Information",
            href: "/staff/gram-panchayat",
            icon: MapPin,
            description: "Gram Panchayat details and data",
          },
        ],
      })
    }

    // Admin-specific sections
    if (["ADMIN", "SUPER_ADMIN"].includes(role)) {
      sections.push({
        title: "Administration",
        description: "Management and control tools",
        items: [
          {
            name: "Admin Panel",
            href: "/admin",
            icon: Settings,
            description: "Administrative controls and settings",
          },
          {
            name: "Manage Staff",
            href: "/admin/users",
            icon: UserCog,
            description: "Staff management and role assignment",
          },
          {
            name: "GP Management",
            href: "/admin/gram-panchayats",
            icon: Building,
            description: "Gram Panchayat administration",
          },
          {
            name: "Reports",
            href: "/admin/reports",
            icon: FileText,
            description: "Generate and view detailed reports",
          },
        ],
      })
    }

    // Super Admin-specific sections
    if (role === "SUPER_ADMIN") {
      sections.push({
        title: "System Administration",
        description: "Complete system control and monitoring",
        items: [
          {
            name: "Super Admin Panel",
            href: "/super-admin",
            icon: Shield,
            description: "System-wide administration",
          },
          {
            name: "All Users",
            href: "/super-admin/users",
            icon: Users,
            description: "Complete user management across all GPs",
          },
          {
            name: "All Gram Panchayats",
            href: "/super-admin/gram-panchayats",
            icon: Globe,
            description: "System-wide GP management",
          },
          {
            name: "System Settings",
            href: "/super-admin/settings",
            icon: Cog,
            description: "Global system configuration",
          },
          {
            name: "Audit Logs",
            href: "/super-admin/audit",
            icon: Activity,
            description: "System activity monitoring and logs",
          },
        ],
      })
    }

    return sections
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
            session.user.role === "SUPER_ADMIN"
              ? "destructive"
              : session.user.role === "ADMIN"
                ? "default"
                : "secondary"
          }
        >
          {session.user.role.replace("_", " ")}
        </Badge>
      </div>

      {/* Menu Sections */}
      <div className="space-y-3">
        {menuSections.map((section, index) => {
          const isOpen = openSections[section.title] ?? true // Default to open

          return (
            <Collapsible
              key={index}
              open={isOpen}
              onOpenChange={() => toggleSection(section.title)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-4 justify-between hover:bg-muted/50"
                  >
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
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {section.items.map((item, itemIndex) => (
                        <Button
                          key={itemIndex}
                          asChild
                          variant="ghost"
                          className="h-auto p-3 justify-start hover:bg-muted/50"
                        >
                          <Link href={item.href}>
                            <div className="flex items-start space-x-3 w-full">
                              <div className="flex-shrink-0 mt-0.5">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm truncate">{item.name}</span>
                                  {item.badge && (
                                    <Badge variant="secondary" className="text-xs shrink-0">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </Button>
                      ))}
                    </div>
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
              <div className="text-2xl font-bold text-blue-600">
                {menuSections.length}
              </div>
              <div className="text-xs text-muted-foreground">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {menuSections.filter(section => openSections[section.title] ?? true).length}
              </div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {menuSections.filter(section => !(openSections[section.title] ?? true)).length}
              </div>
              <div className="text-xs text-muted-foreground">Collapsed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
