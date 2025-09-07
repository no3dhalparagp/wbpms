"use server";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/utils/utils";
import { revalidatePath } from "next/cache";
function parseDate(dateString: string | Date): Date {
  return typeof dateString === "string" ? new Date(dateString) : dateString;
}

// Helper function for payment formatting
function formatPaymentValues(amounts: number[]): string {
  if (amounts.length === 0) return "0.00";
  if (amounts.length === 1) return amounts[0].toFixed(2);
  const formatted = amounts.map((a) => a.toFixed(2));
  const total = amounts.reduce((sum, a) => sum + a, 0).toFixed(2);
  return `${formatted.join(" + ")} = ${total}`;
}




export async function verifyAllDocuments(warishId: string) {
  // Update all documents for this warish application
  await prisma.warishDocument.updateMany({
    where: {
      warishId,
      verified: false,
    },
    data: {
      verified: true,
      remarks: "Verified in bulk",
    },
  });

  // Update the warish application status
  await prisma.warishApplication.update({
    where: { id: warishId },
    data: { warishdocumentverified: true },
  });

  revalidatePath(`/admindashboard/manage-warish/verify-document/${warishId}`);
}
