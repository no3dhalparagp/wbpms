import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { auth } from "@/auth";

async function getAdminStats() {
  const session = await auth();
  if (!session?.user?.gramPanchayatId) {
    return null;
  }

  const gramPanchayatId = session.user.gramPanchayatId;

  const [
    totalUsers,
    totalWarishApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    gramPanchayat,
  ] = await Promise.all([
    prisma.user.count({
      where: { gramPanchayatId },
    }),
    prisma.warishApplication.count({
      where: { gramPanchayatId },
    }),
    prisma.warishApplication.count({
      where: {
        gramPanchayatId,
        warishApplicationStatus: { in: ["submitted", "pending", "process"] },
      },
    }),
    prisma.warishApplication.count({
      where: {
        gramPanchayatId,
        warishApplicationStatus: "approved",
      },
    }),
    prisma.warishApplication.count({
      where: {
        gramPanchayatId,
        warishApplicationStatus: "rejected",
      },
    }),
    prisma.gramPanchayat.findUnique({
      where: { id: gramPanchayatId },
      select: { name: true, district: true, state: true },
    }),
  ]);

  return {
    totalUsers,
    totalWarishApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    gramPanchayat,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getAdminStats();

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            You need to be assigned to a Gram Panchayat to access admin
            features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to {stats.gramPanchayat?.name} administration panel
        </p>
        <Badge variant="outline" className="mt-2">
          {stats.gramPanchayat?.district}, {stats.gramPanchayat?.state}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Users in your Gram Panchayat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalWarishApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Warish applications received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Applications under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Applications approved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest Warish applications in your Gram Panchayat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New application submitted
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Applicant: John Doe - 2 hours ago
                  </p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Application approved
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Applicant: Jane Smith - 1 day ago
                  </p>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Approved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/admin/users"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </a>
              <a
                href="/admin/manage-warish/application"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Manage Warish Applications</span>
              </a>
              <a
                href="/admin/gram-panchayats"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>Gram Panchayat Info</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
