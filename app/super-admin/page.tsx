import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MapPin, 
  Shield, 
  TrendingUp,
  Activity,
  Database,
  Settings
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

async function getSuperAdminStats() {
  const [
    totalUsers,
    totalAdmins,
    totalStaff,
    totalGramPanchayats,
    totalWarishApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    activeUsers,
    inactiveUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'STAFF' } }),
    prisma.gramPanchayat.count(),
    prisma.warishApplication.count(),
    prisma.warishApplication.count({
      where: { warishApplicationStatus: { in: ['submitted', 'pending', 'process'] } }
    }),
    prisma.warishApplication.count({
      where: { warishApplicationStatus: 'approved' }
    }),
    prisma.warishApplication.count({
      where: { warishApplicationStatus: 'rejected' }
    }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } })
  ]);

  return {
    totalUsers,
    totalAdmins,
    totalStaff,
    totalGramPanchayats,
    totalWarishApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    activeUsers,
    inactiveUsers
  };
}

async function getRecentActivity() {
  const [recentUsers, recentApplications] = await Promise.all([
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        gramPanchayat: {
          select: { name: true }
        }
      }
    }),
    prisma.warishApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        applicantName: true,
        warishApplicationStatus: true,
        createdAt: true,
        gramPanchayat: {
          select: { name: true }
        }
      }
    })
  ]);

  return { recentUsers, recentApplications };
}

export default async function SuperAdminDashboard() {
  await requireSuperAdmin();
  const stats = await getSuperAdminStats();
  const { recentUsers, recentApplications } = await getRecentActivity();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'STAFF':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'process':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and administration panel
        </p>
      </div>

      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active, {stats.inactiveUsers} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gram Panchayats</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGramPanchayats}</div>
            <p className="text-xs text-muted-foreground">
              Registered Gram Panchayats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarishApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApplications} pending, {stats.approvedApplications} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              System uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-600" />
              Super Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">1</div>
            <p className="text-sm text-muted-foreground">
              System administrators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-600" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</div>
            <p className="text-sm text-muted-foreground">
              Gram Panchayat administrators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.totalStaff}</div>
            <p className="text-sm text-muted-foreground">
              Field staff members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {user.name || 'No name'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.gramPanchayat?.name} • {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest Warish applications submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {app.applicantName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {app.gramPanchayat.name} • {app.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(app.warishApplicationStatus)}>
                    {app.warishApplicationStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
          <CardDescription>
            Administrative tools and system controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4 flex flex-col items-start">
              <Link href="/super-admin/users">
                <Users className="mb-2 h-6 w-6" />
                <span className="font-medium">User Management</span>
                <span className="text-xs text-muted-foreground">Manage all users</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Link href="/super-admin/gram-panchayats">
                <MapPin className="mb-2 h-6 w-6" />
                <span className="font-medium">Gram Panchayats</span>
                <span className="text-xs text-muted-foreground">Manage locations</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Link href="/dashboard/gram-panchayats">
                <FileText className="mb-2 h-6 w-6" />
                <span className="font-medium">Applications</span>
                <span className="text-xs text-muted-foreground">View all applications</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Link href="/dashboard/users">
                <Database className="mb-2 h-6 w-6" />
                <span className="font-medium">System Reports</span>
                <span className="text-xs text-muted-foreground">Analytics & reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}