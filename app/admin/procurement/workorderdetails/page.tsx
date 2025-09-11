import { prisma } from "@/lib/prisma";
import FinancialWorkDetailsTable from "./FinancialWorkDetailsTable";

export default async function FinancialWorkDetails() {
  const financialWorkDetails = await prisma.worksDetail.findMany({
    where: {
      tenderStatus: "FinancialEvaluation",
    },
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
    },
  });

  return (
    <FinancialWorkDetailsTable financialWorkDetails={financialWorkDetails} />
  );
}
