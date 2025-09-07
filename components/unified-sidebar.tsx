"use client";

import { useState, useEffect } from "react";
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

// Types
type Role = "ADMIN" | "STAFF" | "SUPER_ADMIN";

interface DashboardConfig {
  title: string;
  items: MenuItemProps[];
}

const DASHBOARD_CONFIG: Record<Role, DashboardConfig> = {
  
  admin: {
    title: "Admin Portal",
    items: adminMenuItems,
  },
  staff: {
    title: "Staff Portal",
    items: employeeMenuItems,
  },
  superadmin: {
    title: "Super Admin Portal",
    items: superAdminMenuItems,
  },
};

// Components
function MenuItem({ item, userRole }: { item: MenuItemProps; userRole: Role }) {
  const normalizedRole =
    userRole === "superadmin"
      ? "SUPER_ADMIN"
      : (userRole.toUpperCase() as "ADMIN" | "STAFF");

  if (userRole !== "user" && isRestrictedForRole(item, normalizedRole)) {
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
}

function SidebarContent({ role }: { role: Role }) {
  const config = DASHBOARD_CONFIG[role];

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
          {config.items.map((item) => (
            <MenuItem key={item.menuItemText} item={item} userRole={role} />
          ))}
        </nav>
      </ScrollArea>

      <ImprovedFooter />
    </div>
  );
}

export default function UnifiedSidebar({ role = "user" }: { role?: Role }) {
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
            <SidebarContent role={role} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block shadow-sm">
        <SidebarContent role={role} />
      </div>
    </>
  );
}
