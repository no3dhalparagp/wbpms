import { requireStaff } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

async function getStaffStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const [assignedApplications, pendingTasks, completedTasks, userInfo] =
    await Promise.all([
      prisma.warishApplication.count({
        where: { assingstaffId: userId },
      }),
      prisma.warishApplication.count({
        where: {
          assingstaffId: userId,
          warishApplicationStatus: { in: ["submitted", "pending", "process"] },
        },
      }),
      prisma.warishApplication.count({
        where: {
          assingstaffId: userId,
          warishApplicationStatus: { in: ["approved", "rejected"] },
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          designation: true,
          gramPanchayat: {
            select: { name: true, district: true, state: true },
          },
        },
      }),
    ]);

  return {
    assignedApplications,
    pendingTasks,
    completedTasks,
    userInfo,
  };
}

async function getRecentTasks() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const recentTasks = await prisma.warishApplication.findMany({
    where: { assingstaffId: session.user.id },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      applicantName: true,
      nameOfDeceased: true,
      warishApplicationStatus: true,
      createdAt: true,
      gramPanchayat: {
        select: { name: true },
      },
    },
  });

  return recentTasks;
}

export default async function StaffDashboard() {
  await requireStaff();
  const stats = await getStaffStats();
  const recentTasks = await getRecentTasks();

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Unable to load dashboard data.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
      case "submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "process":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {stats.userInfo?.name || "Staff Member"}
        </p>
        {stats.userInfo?.designation && (
          <Badge variant="outline" className="mt-2">
            {stats.userInfo.designation}
          </Badge>
        )}
        {stats.userInfo?.gramPanchayat && (
          <Badge variant="outline" className="mt-2 ml-2">
            {stats.userInfo.gramPanchayat.name}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Tasks
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedApplications}
            </div>
            <p className="text-xs text-muted-foreground">
              Total assigned applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completedTasks}
            </div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.assignedApplications > 0
                ? Math.round(
                    (stats.completedTasks / stats.assignedApplications) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Task completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your latest assigned Warish applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {task.applicantName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deceased: {task.nameOfDeceased}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.gramPanchayat.name} •{" "}
                        {task.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        className={getStatusColor(task.warishApplicationStatus)}
                      >
                        {task.warishApplicationStatus}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/staff/tasks/${task.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No tasks assigned yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common staff tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link href="/staff/tasks">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Tasks
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/staff/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/staff/gram-panchayat">
                  <MapPin className="mr-2 h-4 w-4" />
                  Gram Panchayat Info
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
