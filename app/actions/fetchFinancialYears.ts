import { prisma } from "@/lib/prisma"

export async function fetchFinancialYears() {
  try {
    const years = await prisma.approvedActionPlanDetails.findMany({
      distinct: ["financialYear"],
      select: {
        financialYear: true,
      },
      orderBy: {
        financialYear: "desc",
      },
    })

    return years
  } catch (error) {
    console.error("Failed to fetch financial years:", error)
    throw new Error("Failed to fetch financial years")
  }
}
