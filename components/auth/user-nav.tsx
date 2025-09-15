"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { LogOut, Settings, User, KeyRound } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "text-red-600"
      case "ADMIN":
        return "text-blue-600"
      case "STAFF":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback>{session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <p className={`text-xs font-medium ${getRoleColor(session.user.role)}`}>
              {session.user.role.replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <div className="flex items-center"><User className="mr-2 h-4 w-4" /><span>Profile</span></div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/change-password">
            <div className="flex items-center"><KeyRound className="mr-2 h-4 w-4" /><span>Change Password</span></div>
          </Link>
        </DropdownMenuItem>
        {session.user?.role === "SUPER_ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/super-admin/settings">
              <div className="flex items-center"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></div>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
