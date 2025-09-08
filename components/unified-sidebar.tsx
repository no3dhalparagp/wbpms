"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp, Menu, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
  type MenuItemProps,
  isRestrictedForRole,
} from "@/constants/menu-constants";
import type { RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/slices/menuSlice";
import ImprovedFooter from "./improved-footer";
import useSWR from "swr";
import { hasRequiredSubscription, isFeatureEnabled } from "@/lib/utils";

// Types
type Role = "ADMIN" | "STAFF" | "SUPER_ADMIN";

interface DashboardConfig {
  title: string;
  items: MenuItemProps[];
}

const DASHBOARD_CONFIG: Record<Role, DashboardConfig> = {
  ADMIN: {
    title: "Admin Portal",
    items: adminMenuItems,
  },
  STAFF: {
    title: "Staff Portal",
    items: employeeMenuItems,
  },
  SUPER_ADMIN: {
    title: "Super Admin Portal",
    items: superAdminMenuItems,
  },
};

// Components
const MenuItem: React.FC<{
  item: MenuItemProps;
  userRole: Role;
  subscriptionLevel: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
}> = ({ item, userRole, subscriptionLevel }) => {
  if (isRestrictedForRole(item, userRole)) return null;
  if (!hasRequiredSubscription(subscriptionLevel, item.minSubscriptionLevel)) return null;
  return (
    <Button
      asChild
      variant="ghost"
      className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 transition-colors"
    >
      <Link href={item.menuItemLink || "#"}>
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

const SidebarMenuItem: React.FC<{ item: MenuItemProps; userRole: Role, subscriptionLevel: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE" }> = ({ item, userRole, subscriptionLevel }) => {
  const normalizedRole = userRole;

  if (isRestrictedForRole(item, normalizedRole)) {
    return null;
  }
  if (!hasRequiredSubscription(subscriptionLevel, item.minSubscriptionLevel)) {
    return null;
}

  return (
    <Button
      asChild
      variant="ghost"
      className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 transition-colors"
    >
      <Link href={item.menuItemLink || "#"}>
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

function SidebarContent({ role, subscription }: { role: Role, subscription: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE" }) {
  const config = DASHBOARD_CONFIG[role];
  const { data } = useSWR<{ settings: Record<string, boolean> }>(
    "/api/system-settings",
    (url: string) => fetch(url).then((r) => r.json())
  );
  const featureMap: Record<string, boolean> = (data?.settings as Record<string, boolean>) || {};

  return (
    <div className="w-64 flex-shrink-0 border-r bg-background h-full flex flex-col">
      <header className="h-14 border-b p-3 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-foreground">
          {config.title}
        </h1>
        <Avatar className="w-7 h-7">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            <User className="w-3 h-3" />
          </AvatarFallback>
        </Avatar>
      </header>

      <ScrollArea className="flex-grow p-2">
        <nav className="space-y-1" aria-label={`${role} navigation`}>

          {config.items
            .filter((i) => isFeatureEnabled(i.featureKey, featureMap))
            .map((item) => (
              <MenuItem key={item.menuItemText} item={item} userRole={role} subscriptionLevel={subscription} />
            ))}
          {config.items.map((item) => (
            <SidebarMenuItem key={item.menuItemText} item={item} userRole={role} subscriptionLevel={subscription} />
          ))}

        </nav>
      </ScrollArea>

      <ImprovedFooter />
    </div>
  );
}


export default function UnifiedSidebar({ role }: { role?: Role }) {
  const { data: session } = useSession();

  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) return null;

  const userRole: Role = role || (session?.user?.role as Role) || "STAFF";
  const subscription: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE" = (session?.user?.subscriptionLevel as any) || "BASIC";

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur shadow-lg 
                        rounded-full w-10 h-10 hover:bg-primary/20 hover:scale-110 
                        transition-transform"
              onClick={handleToggleMenu}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 shadow-xl border-0">
            <SidebarContent role={userRole} subscription={subscription} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block shadow-sm">
        <SidebarContent role={userRole} subscription={subscription} />
      </div>
    </>
  );
}
