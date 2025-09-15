"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, UserCheck, UserX, Shield, Users } from "lucide-react"
import { Role } from "@prisma/client"
import { updateUserRoleAdmin, toggleUserStatusAdmin } from "@/app/actions/admin-actions"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string | null
  email: string
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  image: string | null
}

interface AdminUserManagementTableProps {
  users: User[]
}

export function AdminUserManagementTable({ users }: AdminUserManagementTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "STAFF":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setIsLoading(userId)
    try {
      await updateUserRoleAdmin(userId, newRole)
      router.refresh()
    } catch (error) {
      console.error("Failed to update user role:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleStatusToggle = async (userId: string) => {
    setIsLoading(userId)
    try {
      await toggleUserStatusAdmin(userId)
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle user status:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manageable Users</CardTitle>
        <CardDescription>
          Staff and Admin users you can manage. Total users: {users.length}
          <br />
          <span className="text-xs text-muted-foreground">
            Note: Super Admin users are not shown and cannot be managed by regular admins.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || "No name"}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading === user.id}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Role Management - Limited to STAFF and ADMIN */}
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, Role.STAFF)}>
                        <Users className="mr-2 h-4 w-4" />
                        Make Staff
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, Role.ADMIN)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Status Management */}
                      <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                        {user.isActive ? (
                          <>
                            <UserX className="mr-2 h-4 w-4 text-red-600" />
                            Deactivate User
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                            Activate User
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
