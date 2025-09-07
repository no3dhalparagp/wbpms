"use client";

import type { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Menu,
  X,
  Settings,
  User,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
  type MenuItemProps,
} from "@/constants/menu-constants";
import useSWR from "swr";
import { isFeatureEnabled } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session?.user) return null;
  const getMenuItems = (role: string): MenuItemProps[] => {
    const normalizedRole = role.toUpperCase() as
      | "ADMIN"
      | "STAFF"
      | "SUPER_ADMIN";
    switch (normalizedRole) {
      case "ADMIN":
        return adminMenuItems.filter((i) =>
          i.allowedRoles.includes(normalizedRole)
        );
      case "STAFF":
        return employeeMenuItems.filter((i) =>
          i.allowedRoles.includes(normalizedRole)
        );
      case "SUPER_ADMIN":
        // Keep super admin list concise; do not merge admin list
        return superAdminMenuItems.filter((i) =>
          i.allowedRoles.includes(normalizedRole)
        );
      default:
        return [];
    }
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) =>
    setExpanded((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }));

  const renderMenuTree = (item: MenuItemProps, path: string, depth = 0) => {
    const key = `${path}/${item.menuItemText}`;
    const indentClass = depth > 0 ? `pl-${Math.min(4 + depth * 2, 12)}` : "";

    if (item.submenu && item.subMenuItems?.length) {
      const isOpen = !!expanded[key];
      return (
        <div key={key} className="w-full">
          <button
            type="button"
            className={`w-full flex items-center justify-between h-9 px-3 text-sm font-normal rounded-md hover:bg-accent/50 transition-colors ${indentClass}`}
            onClick={() => toggleExpand(key)}
          >
            <div className="flex items-center space-x-3">
              {item.Icon && (
                <item.Icon
                  className={`h-4 w-4 ${item.color || "text-muted-foreground"}`}
                />
              )}
              <span>{item.menuItemText}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {isOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {item.subMenuItems
                .filter((s) => isFeatureEnabled(s.featureKey, featureMap))
                .map((sub) => renderMenuTree(sub, key, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={key}
        asChild
        variant="ghost"
        className={`w-full justify-start h-9 px-3 text-sm font-normal ${indentClass}`}
      >
        <Link
          href={item.menuItemLink || "#"}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="flex items-center space-x-3">
            {item.Icon && (
              <item.Icon
                className={`h-4 w-4 ${item.color || "text-muted-foreground"}`}
              />
            )}
            <span>{item.menuItemText}</span>
          </div>
        </Link>
      </Button>
    );
  };

  const menuItems = getMenuItems(session.user.role);
  const { data } = useSWR<{ settings: Record<string, boolean> }>(
    "/api/system-settings",
    (url: string) => fetch(url).then((r) => r.json())
  );
  const featureMap: Record<string, boolean> = data?.settings || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">GP Management</h1>
            <p className="text-xs text-muted-foreground">
              {session.user.gramPanchayat?.name || "System"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-3 p-2 bg-muted rounded-lg">
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
              <span className="text-sm font-medium">
                {session.user.role.replace("_", " ")} Access
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {session.user.name}
            </p>
          </div>
          <nav className="space-y-1">
            {menuItems
              .filter((i) => isFeatureEnabled(i.featureKey, featureMap))
              .map((item) => renderMenuTree(item, "root"))}
          </nav>
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
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/40"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70 border-b flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
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
                <p className="text-xs text-muted-foreground">
                  {session.user.role.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
