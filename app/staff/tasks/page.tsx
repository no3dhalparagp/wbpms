import { requireStaff } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Search, 
  Filter,
  Eye,
  Edit,
  Calendar,
  User,
  MapPin
} from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

async function getStaffTasks() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const tasks = await prisma.warishApplication.findMany({
    where: { assingstaffId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      acknowlegment: true,
      applicantName: true,
      applicantMobileNumber: true,
      nameOfDeceased: true,
      dateOfDeath: true,
      warishApplicationStatus: true,
      createdAt: true,
      updatedAt: true,
      gramPanchayat: {
        select: { name: true, district: true, state: true }
      }
    }
  });

  return tasks;
}

export default async function StaffTasksPage() {
  await requireStaff();
  const tasks = await getStaffTasks();

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

  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      case 'process':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">
          Manage your assigned Warish applications
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Assigned applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => ['submitted', 'pending', 'process'].includes(t.warishApplicationStatus)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.warishApplicationStatus === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => t.warishApplicationStatus === 'rejected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Rejected applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Search and manage your assigned Warish applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by applicant name, deceased name, or acknowledgment number..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Tasks Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acknowledgment</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Deceased</TableHead>
                  <TableHead>Date of Death</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gram Panchayat</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.acknowlegment}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.applicantName}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.applicantMobileNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{task.nameOfDeceased}</TableCell>
                      <TableCell>
                        {task.dateOfDeath.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.warishApplicationStatus)}>
                          {task.warishApplicationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{task.gramPanchayat.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {task.gramPanchayat.district}, {task.gramPanchayat.state}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/staff/tasks/${task.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {['submitted', 'pending', 'process'].includes(task.warishApplicationStatus) && (
                            <Button size="sm" asChild>
                              <Link href={`/staff/tasks/${task.id}/process`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No tasks assigned yet</p>
                        <p className="text-sm text-muted-foreground">
                          Contact your administrator to get assigned tasks
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}