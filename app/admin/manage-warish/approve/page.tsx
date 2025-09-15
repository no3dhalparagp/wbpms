import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { WarishApplicationProps } from "@/types";
import { DataTable } from "@/components/data-table";
import { warishcolref } from "@/components/table-col-ref/Warishapplication";

async function getWarishApplications() {
  const session = await auth();
  const where: any = { warishApplicationStatus: "pending" };
  if (session?.user?.role === "ADMIN" && session.user.gramPanchayatId) {
    where.gramPanchayatId = session.user.gramPanchayatId;
  }
  return (await prisma.warishApplication.findMany({
    where,
    orderBy: {
      reportingDate: "desc",
    },
  })) as unknown as WarishApplicationProps[];
}

export default async function PendingWarishApplications() {
  const applications = await getWarishApplications();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Pending Warish Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <DataTable columns={warishcolref} data={applications} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
