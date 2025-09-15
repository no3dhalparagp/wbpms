import { currentgpuserlogin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function fetchFinancialYears() {

  const user = await currentgpuserlogin()
  if (!user) {
    throw new Error("User not authenticated")
  }


  try {
    const years = await prisma.approvedActionPlanDetails.findMany({
      where:{
gramPanchayatId: user
      },
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
