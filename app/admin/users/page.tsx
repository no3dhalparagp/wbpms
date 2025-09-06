import { requireAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { AdminUserManagementTable } from "@/components/admin/admin-user-management-table"

async function getAdminUsers() {
  return await prisma.user.findMany({
    where: {
      role: {
        in: ["STAFF", "ADMIN"], // Admins can only manage STAFF and ADMIN users, not SUPER_ADMIN
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      image: true,
      gramPanchayatId: true,
      designation: true,
      employeeId: true,
    },
    include: {
      gramPanchayat: {
        select: {
          name: true,
          code: true,
          district: true,
          state: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export default async function AdminUsersPage() {
  await requireAdmin()
  const users = await getAdminUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage staff and admin users. You can promote staff to admin roles and manage account status.
        </p>
      </div>

      <AdminUserManagementTable users={users} />
    </div>
  )
}
