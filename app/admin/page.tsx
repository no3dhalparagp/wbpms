import { requireAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Shield, Activity, TrendingUp } from "lucide-react"

async function getAdminStats() {
  const [totalUsers, activeUsers, staffUsers, adminUsers, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ])

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    staffUsers,
    adminUsers,
    recentUsers,
  }
}

export default async function AdminPage() {
  const session = await requireAdmin()
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and monitor system activity. Welcome, {session.user.name}!</p>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.staffUsers}</div>
            <p className="text-xs text-muted-foreground">Staff role users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.recentUsers}</div>
            <p className="text-xs text-muted-foreground">Recent registrations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Overview of user roles and status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Staff Users</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {stats.staffUsers}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Admin Users</span>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {stats.adminUsers}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Active Accounts</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.activeUsers}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserX className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Inactive Accounts</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {stats.inactiveUsers}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Admin Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Capabilities</CardTitle>
            <CardDescription>What you can do as an administrator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">User Role Management</h4>
              <p className="text-xs text-muted-foreground">Promote staff to admin roles and manage user permissions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Account Status Control</h4>
              <p className="text-xs text-muted-foreground">Activate or deactivate user accounts as needed</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">System Monitoring</h4>
              <p className="text-xs text-muted-foreground">Monitor user activity and system health</p>
            </div>
            <div className="p-3 border rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-1">Limited Access</h4>
              <p className="text-xs text-muted-foreground">Cannot create super admins or access super admin features</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Activity */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Recent system events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">System Status: Operational</p>
                <p className="text-xs text-muted-foreground">All services running normally</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">User Registrations</p>
                <p className="text-xs text-muted-foreground">{stats.recentUsers} new users this week</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Active
              </Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Authentication</p>
                <p className="text-xs text-muted-foreground">Google OAuth integration active</p>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Secure
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
