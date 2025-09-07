import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { UserManagementTable } from "@/components/super-admin/user-management-table";
import { auth } from "@/auth";
import { getAllGramPanchayats } from "@/data/gram-panchayat";

async function getAllUsers() {
  return await prisma.user.findMany({
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
  });
}

export default async function UsersPage() {
  await requireSuperAdmin();
  const [users, gramPanchayats] = await Promise.all([
    getAllUsers(),
    getAllGramPanchayats(),
  ]);
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser) {
    return null;
  }

  // Transform gram panchayats data to match the expected format
  const transformedGramPanchayats =
    gramPanchayats?.map((gp) => ({
      id: gp.id,
      name: gp.name,
      district: gp.district,
      state: gp.state,
    })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all user accounts, roles, and permissions across the system.
        </p>
      </div>

      <UserManagementTable
        users={users}
        currentUser={{
          id: currentUser.id,
          role: currentUser.role,
        }}
        gramPanchayats={transformedGramPanchayats}
      />
    </div>
  );
}
