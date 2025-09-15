import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)))
    const query = (searchParams.get('q') || '').trim()
    const focusId = searchParams.get('focusId') || ''

    const where = {
      warishApplicationStatus: { in: ["approved", "renewed"] as any },
      WarishDocument: { none: { documentType: 'WarishCertificate' } },
      ...(query
        ? {
            OR: [
              { applicantName: { contains: query, mode: 'insensitive' } },
              { nameOfDeceased: { contains: query, mode: 'insensitive' } },
              { warishRefNo: { contains: query, mode: 'insensitive' } },
              { acknowlegment: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    } as any

    const [total, items] = await Promise.all([
      prisma.warishApplication.count({ where }),
      prisma.warishApplication.findMany({
        where,
        include: { warishDetails: true },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    // If a focusId is provided, attempt to compute which page contains it
    let pageOfFocus: number | null = null
    if (focusId) {
      const target = await prisma.warishApplication.findFirst({
        where: { id: focusId, ...where },
        select: { id: true, updatedAt: true },
      })
      if (target) {
        // Count how many records would come before the target using the same ordering
        const numBefore = await prisma.warishApplication.count({
          where: {
            ...where,
            updatedAt: { gt: target.updatedAt },
          } as any,
        })
        pageOfFocus = Math.floor(numBefore / pageSize) + 1
      }
    }

    return NextResponse.json({ total, items, page, pageSize, pageOfFocus })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
