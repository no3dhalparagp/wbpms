"use client"

import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/auth/user-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Menu,
  X,
  UserCog,
  User,
  CheckSquare,
  MapPin,
  Building,
  FileText,
  Cog,
  Activity,
} from "lucide-react"
import { useState } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!session?.user) return null

  const getNavigationByRole = (role: string) => {
    const baseNavigation = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["STAFF", "ADMIN", "SUPER_ADMIN"],
        description: "Overview and statistics",
      },
    ]

    const staffNavigation = [
      {
        name: "My Profile",
        href: "/staff/profile",
        icon: User,
        roles: ["STAFF", "ADMIN", "SUPER_ADMIN"],
        description: "Personal information and settings",
      },
      {
        name: "My Tasks",
        href: "/staff/tasks",
        icon: CheckSquare,
        roles: ["STAFF", "ADMIN", "SUPER_ADMIN"],
        description: "Assigned tasks and activities",
      },
      {
        name: "GP Information",
        href: "/staff/gram-panchayat",
        icon: MapPin,
        roles: ["STAFF", "ADMIN", "SUPER_ADMIN"],
        description: "Gram Panchayat details",
      },
    ]

    const adminNavigation = [
      {
        name: "Admin Panel",
        href: "/admin",
        icon: Settings,
        roles: ["ADMIN", "SUPER_ADMIN"],
        description: "Administrative controls",
      },
      {
        name: "Manage Staff",
        href: "/admin/users",
        icon: UserCog,
        roles: ["ADMIN", "SUPER_ADMIN"],
        description: "Staff management and roles",
      },
      {
        name: "GP Management",
        href: "/admin/gram-panchayats",
        icon: Building,
        roles: ["ADMIN", "SUPER_ADMIN"],
        description: "Gram Panchayat administration",
      },
      {
        name: "Reports",
        href: "/admin/reports",
        icon: FileText,
        roles: ["ADMIN", "SUPER_ADMIN"],
        description: "Generate and view reports",
      },
    ]

    const superAdminNavigation = [
      {
        name: "Super Admin",
        href: "/super-admin",
        icon: Shield,
        roles: ["SUPER_ADMIN"],
        description: "System administration",
      },
      {
        name: "All Users",
        href: "/super-admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN"],
        description: "Complete user management",
      },
      {
        name: "All GPs",
        href: "/super-admin/gram-panchayats",
        icon: Building,
        roles: ["SUPER_ADMIN"],
        description: "System-wide GP management",
      },
      {
        name: "System Settings",
        href: "/super-admin/settings",
        icon: Cog,
        roles: ["SUPER_ADMIN"],
        description: "Global system configuration",
      },
      {
        name: "Audit Logs",
        href: "/super-admin/audit",
        icon: Activity,
        roles: ["SUPER_ADMIN"],
        description: "System activity monitoring",
      },
    ]

    let navigation = [...baseNavigation]

    if (role === "STAFF") {
      navigation = [...navigation, ...staffNavigation]
    } else if (role === "ADMIN") {
      navigation = [...navigation, ...staffNavigation, ...adminNavigation]
    } else if (role === "SUPER_ADMIN") {
      navigation = [...navigation, ...staffNavigation, ...adminNavigation, ...superAdminNavigation]
    }

    return navigation.filter((item) => item.roles.includes(role))
  }

  const navigation = getNavigationByRole(session.user.role)

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
                  session.user.role === "SUPER_ADMIN"
                    ? "bg-red-500"
                    : session.user.role === "ADMIN"
                      ? "bg-blue-500"
                      : "bg-green-500"
                }`}
              />
              <span className="text-sm font-medium">{session.user.role.replace("_", " ")} Access</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{session.user.name}</p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name} className="group">
                <Button asChild variant="ghost" className="w-full justify-start h-auto p-3">
                  <Link href={item.href}>
                    <div className="flex items-start space-x-3">
                      <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            ))}
          </nav>
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
            <UserNav />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
