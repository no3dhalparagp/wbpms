export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import React from 'react'
import { prisma } from '@/lib/prisma'
import WarishPrintListClient from '@/components/WarishPrintListClient'

export default async function Page() {
  const docs = await prisma.warishDocument.findMany({
    where: { documentType: 'WarishCertificate' },
    include: { warish: true },
    orderBy: { createdAt: 'desc' },
  })

  const items = docs.map((d) => ({
    id: d.id,
    applicantName: d.warish.applicantName,
    nameOfDeceased: d.warish.nameOfDeceased,
    warishRefNo: d.warish.warishRefNo,
    warishRefDate: d.warish.warishRefDate,
    documentUrl: d.cloudinaryUrl,
  }))

  return <WarishPrintListClient items={items} />
}
