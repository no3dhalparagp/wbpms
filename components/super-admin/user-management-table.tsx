"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Users,
  Loader2,
} from "lucide-react";
import { Role } from "@prisma/client";
import {
  updateUserRole,
  toggleUserStatus,
  updateUserLocation,
} from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LocationChangeDialog } from "./location-change-dialog";

interface GramPanchayat {
  name: string;
  code: string;
  district: string;
  state: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  gramPanchayatId: string | null;
  designation: string | null;
  employeeId: string | null;
  gramPanchayat: GramPanchayat | null;
}

interface UserManagementTableProps {
  users: User[];
  currentUser: {
    id: string;
    role: Role;
  };
  gramPanchayats: Array<{
    id: string;
    name: string;
    district: string;
    state: string;
  }>;
}

export function UserManagementTable({
  users: initialUsers,
  currentUser,
  gramPanchayats,
}: UserManagementTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "role" | "status" | "location" | null
  >(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Sync local state when initialUsers changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const getRoleColor = (role: Role) => {
    switch (role) {
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

  const canModifyUser = (targetUser: User) => {
    // Guard clause for undefined currentUser
    if (!currentUser?.id || !currentUser?.role) return false;

    // Users cannot modify themselves
    if (targetUser.id === currentUser.id) return false;

    // SUPER_ADMIN can modify anyone
    if (currentUser.role === "SUPER_ADMIN") {
      return true; // Changed this line to allow SUPER_ADMIN to modify anyone
    }

    // ADMIN can modify STAFF but not other ADMINs or SUPER_ADMINs
    if (currentUser.role === "ADMIN") {
      return targetUser.role === "STAFF";
    }

    // STAFF cannot modify any users
    return false;
  };

  const canAssignRole = (newRole: Role) => {
    // Guard clause for undefined currentUser
    if (!currentUser?.role) return false;

    // SUPER_ADMIN can assign any role
    if (currentUser.role === "SUPER_ADMIN") return true;

    // ADMIN can only assign STAFF role
    if (currentUser.role === "ADMIN") {
      return newRole === "STAFF";
    }

    // Other roles cannot assign roles
    return false;
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (userId === currentUser.id) {
      toast.error("You cannot change your own role");
      return;
    }

    setIsLoading(userId);
    setActionType("role");

    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        // Update local state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success("User role updated successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setIsLoading(null);
      setActionType(null);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    if (userId === currentUser.id) {
      toast.error("You cannot change your own status");
      return;
    }

    setIsLoading(userId);
    setActionType("status");

    try {
      const result = await toggleUserStatus(userId);
      if (result.success) {
        // Update local state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user
          )
        );
        toast.success("User status updated successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(null);
      setActionType(null);
    }
  };

  const handleLocationChange = async (
    userId: string,
    gramPanchayatId: string
  ) => {
    setIsLoading(userId);
    setActionType("location");

    try {
      const result = await updateUserLocation(userId, gramPanchayatId);
      if (result.success) {
        // Find the gram panchayat details
        const selectedGP = gramPanchayats.find(
          (gp) => gp.id === gramPanchayatId
        );

        // Update local state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  gramPanchayatId,
                  gramPanchayat: selectedGP
                    ? {
                        name: selectedGP.name,
                        code: "", // We don't have code in the gramPanchayats prop
                        district: selectedGP.district,
                        state: selectedGP.state,
                      }
                    : null,
                }
              : user
          )
        );
        toast.success("User location updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update user location");
      }
    } catch (error) {
      console.error("Failed to update user location:", error);
      toast.error("Failed to update user location");
    } finally {
      setIsLoading(null);
      setActionType(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Manage user roles and account status. Total users: {users.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
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
                    <AvatarFallback>
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.name || "No name"}
                      {user.employeeId && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({user.employeeId})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                      {user.designation && (
                        <span className="ml-2 italic">{user.designation}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.gramPanchayat ? (
                    <div className="text-sm">
                      <div>{user.gramPanchayat.name}</div>
                      <div className="text-muted-foreground">
                        {user.gramPanchayat.district},{" "}
                        {user.gramPanchayat.state}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isLoading === user.id}
                      >
                        {isLoading === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <span className="sr-only">
                              Open menu for {user.name || user.email}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        Actions for {user.name || user.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Show message if no actions available */}
                      {!canModifyUser(user) ? (
                        <DropdownMenuItem
                          disabled
                          className="text-muted-foreground"
                        >
                          No available actions
                        </DropdownMenuItem>
                      ) : (
                        <>
                          {/* Role Management */}
                          {canAssignRole(Role.STAFF) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(user.id, Role.STAFF)
                              }
                              disabled={
                                user.role === Role.STAFF ||
                                isLoading === user.id
                              }
                              className="flex items-center"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Make Staff
                              {isLoading === user.id &&
                                actionType === "role" && (
                                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                            </DropdownMenuItem>
                          )}

                          {canAssignRole(Role.ADMIN) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(user.id, Role.ADMIN)
                              }
                              disabled={
                                user.role === Role.ADMIN ||
                                isLoading === user.id
                              }
                              className="flex items-center"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                              {isLoading === user.id &&
                                actionType === "role" && (
                                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                            </DropdownMenuItem>
                          )}

                          {canAssignRole(Role.SUPER_ADMIN) && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(user.id, Role.SUPER_ADMIN)
                              }
                              disabled={
                                user.role === Role.SUPER_ADMIN ||
                                isLoading === user.id
                              }
                              className="flex items-center"
                            >
                              <Shield className="mr-2 h-4 w-4 text-red-600" />
                              Make Super Admin
                              {isLoading === user.id &&
                                actionType === "role" && (
                                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {/* Location Management */}
                          <div className="px-2 py-1.5">
                            <LocationChangeDialog
                              userId={user.id}
                              currentLocation={user.gramPanchayatId}
                              onLocationChange={(gramPanchayatId) =>
                                handleLocationChange(user.id, gramPanchayatId)
                              }
                              gramPanchayats={gramPanchayats}
                            />
                          </div>

                          <DropdownMenuSeparator />

                          {/* Status Management */}
                          <DropdownMenuItem
                            onClick={() => handleStatusToggle(user.id)}
                            disabled={isLoading === user.id}
                            className="flex items-center"
                          >
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
                            {isLoading === user.id &&
                              actionType === "status" && (
                                <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                              )}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
