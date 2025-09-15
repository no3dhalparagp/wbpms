import { prisma } from "@/lib/prisma";
import WarishGenerateListClient from "@/components/WarishGenerateListClient";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const where: any = {
    warishApplicationStatus: { in: ["approved", "renewed"] },
    WarishDocument: { none: { documentType: "WarishCertificate" } },
  };
  if (session?.user?.role === "ADMIN" && session.user.gramPanchayatId) {
    where.gramPanchayatId = session.user.gramPanchayatId;
  }

  const applications = await prisma.warishApplication.findMany({
    where,
    include: { warishDetails: true },
    orderBy: { updatedAt: "desc" },
  });

  return <WarishGenerateListClient applications={applications as any} />;
}
