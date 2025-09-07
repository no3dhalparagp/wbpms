"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyDocument(documentId: string, warishId: string) {
  await prisma.warishDocument.update({
    where: { id: documentId },
    data: { verified: true, remarks: "Manually verified" },
  });

  revalidatePath(`/admindashboard/manage-warish/verify-document/${warishId}`);
}

export async function rejectDocument(documentId: string, warishId: string) {
  await prisma.warishDocument.update({
    where: { id: documentId },
    data: { verified: false, remarks: "Manually rejected" },
  });

  revalidatePath(`/admindashboard/manage-warish/verify-document/${warishId}`);
}
