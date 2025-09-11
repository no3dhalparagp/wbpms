"use server";

import { prisma } from "@/lib/prisma";

type CreateAgreementInput = {
  aggrementno: string;
  aggrementdate: string;
  approvedActionPlanDetailsId: string;
  bidagencyId: string;
};

export async function createAgreement(input: CreateAgreementInput) {
  const {
    aggrementno,
    aggrementdate,
    approvedActionPlanDetailsId,
    bidagencyId,
  } = input;

  try {
    const newAgreement = await prisma.aggrementModel.create({
      data: {
        aggrementno,
        aggrementdate,
        workdetails: {
          connect: { id: approvedActionPlanDetailsId },
        },
        acceptagency: {
          connect: { id: bidagencyId },
        },
      },
      include: {
        workdetails: true,
        acceptagency: true,
      },
    });

    return { success: true, agreement: newAgreement };
  } catch (error) {
    console.error("Failed to create agreement:", error);
    return {
      error: "Failed to create agreement",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await prisma.$disconnect();
  }
}
