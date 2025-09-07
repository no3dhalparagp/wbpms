"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
  type MenuItemProps,
} from "@/constants/menu-constants";
import { isFeatureEnabled } from "@/lib/utils";
import useSWR from "swr";
import { useMemo } from "react";

export function RoleSpecificMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const getMenuItems = (role: string): MenuItemProps[] => {
    const normalizedRole = role.toUpperCase() as
      | "ADMIN"
      | "STAFF"
      | "SUPER_ADMIN";

    switch (normalizedRole) {
      case "ADMIN":
        return adminMenuItems.filter((item) =>
          item.allowedRoles.includes(normalizedRole)
        );
      case "STAFF":
        return employeeMenuItems.filter((item) =>
          item.allowedRoles.includes(normalizedRole)
        );
      case "SUPER_ADMIN":
        return superAdminMenuItems.filter((item) =>
          item.allowedRoles.includes(normalizedRole)
        );
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(session.user.role);
  const { data } = useSWR<{ settings: Record<string, boolean> }>(
    "/api/system-settings",
    (url: string) => fetch(url).then((r) => r.json())
  );
  const featureMap: Record<string, boolean> = data?.settings || {};
  const filteredItems = useMemo(() => {
    const filterByFeature = (items: MenuItemProps[]): MenuItemProps[] =>
      items
        .filter((i) => isFeatureEnabled(i.featureKey, featureMap))
        .map((i) => ({
          ...i,
          subMenuItems: filterByFeature(i.subMenuItems || []),
        }));
    return filterByFeature(menuItems);
  }, [menuItems, featureMap]);

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "STAFF":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Navigation
          </h3>
          <Badge className={getRoleColor(session.user.role)}>
            {session.user.role.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Menu Items */}
      <div className="space-y-1">
        {filteredItems.map((item: MenuItemProps, index: number) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            className="w-full justify-start h-9 px-3 text-sm font-normal"
          >
            <Link href={item.menuItemLink || "#"}>
              <div className="flex items-center space-x-3">
                {item.Icon && (
                  <item.Icon
                    className={`h-4 w-4 ${
                      item.color || "text-muted-foreground"
                    }`}
                  />
                )}
                <span>{item.menuItemText}</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>

      <Separator />

      {/* Quick Info */}
      <div className="px-3 py-2">
        <div className="text-xs text-muted-foreground">
          {menuItems.length} menu items available
        </div>
      </div>
    </div>
  );
}
