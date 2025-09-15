import { DataTable } from "@/components/data-table";
import React, { Suspense } from "react";
import { warishapplicationColref } from "./columns";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  const where: any = {};
  if (session?.user?.role === "ADMIN" && session.user.gramPanchayatId) {
    where.gramPanchayatId = session.user.gramPanchayatId;
  }

  const application = await prisma.warishApplication.findMany({
    where,
    orderBy: { acknowlegment: "desc" },
  });
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Warish Application Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable data={application} columns={warishapplicationColref} />
      </Suspense>
    </div>
  );
};

export default page;
