export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StaffAssignmentForm from "@/components/staff-assignment-form";

import {auth  } from "@/auth";

const statusVariant: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800",
  process: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function WarishManagement() {
  // Get the current user session to determine the Gram Panchayat
  const session = await auth()
  const currentUserId = session?.user?.id;
  
  // Get current user's Gram Panchayat ID
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { gramPanchayatId: true }
  });
  
  const gramPanchayatId = currentUser?.gramPanchayatId;

  const [pending, assigned] = await Promise.all([
    prisma.warishApplication.findMany({
      where: {
        warishApplicationStatus: "submitted",
        User: { NOT: { role: "STAFF" } },
        ...(gramPanchayatId && { gramPanchayatId }) // Filter by Gram Panchayat if available
      },
      include: { User: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.warishApplication.findMany({
      where: {
        warishApplicationStatus: "process",
        assingstaffId: { not: null },
        ...(gramPanchayatId && { gramPanchayatId }) // Filter by Gram Panchayat if available
      },
      include: { User: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Filter staff members by Gram Panchayat
  const staffMembers = await prisma.user.findMany({
    where: {
      role: "STAFF",
      isActive: true,
      ...(gramPanchayatId && { gramPanchayatId }) // Filter by Gram Panchayat if available
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Filter out staff members with null names
  const validStaffMembers = staffMembers.filter(
    (staff): staff is { id: string; name: string } => staff.name !== null
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Warish Application Management</h1>
        {gramPanchayatId && (
          <Badge variant="outline" className="ml-2">
            Filtered by Gram Panchayat
          </Badge>
        )}
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned ({assigned.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Applications */}
        <TabsContent value="pending">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Deceased</TableHead>
                  <TableHead>Death Date</TableHead>
                  <TableHead>Assign Staff</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono">
                      {app.acknowlegment}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{app.applicantName}</div>
                        <div className="text-sm text-gray-500">
                          {app.applicantMobileNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{app.nameOfDeceased}</TableCell>
                    <TableCell>
                      {format(app.dateOfDeath, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <StaffAssignmentForm
                        applicationId={app.id}
                        staffMembers={validStaffMembers}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusVariant[app.warishApplicationStatus]}
                      >
                        {app.warishApplicationStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {pending.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No pending applications found
                      {gramPanchayatId && " for your Gram Panchayat"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Assigned Applications */}
        <TabsContent value="assigned">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App ID</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Assigned On</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assigned.map((app) => {
                  const staff = staffMembers.find(
                    (s) => s.id === app.assingstaffId
                  );
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono">
                        {app.acknowlegment}
                      </TableCell>
                      <TableCell>{staff ? staff.name : "Unassigned"}</TableCell>
                      <TableCell>
                        {format(app.updatedAt, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        {format(app.updatedAt, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusVariant[app.warishApplicationStatus]}
                        >
                          {app.warishApplicationStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {assigned.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No assigned applications found
                      {gramPanchayatId && " for your Gram Panchayat"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
