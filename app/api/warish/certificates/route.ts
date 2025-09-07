import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)))
    const query = (searchParams.get('q') || '').trim()

    const where = {
      documentType: 'WarishCertificate',
      ...(query
        ? {
            OR: [
              { warish: { applicantName: { contains: query, mode: 'insensitive' } } },
              { warish: { nameOfDeceased: { contains: query, mode: 'insensitive' } } },
              { warish: { warishRefNo: { contains: query, mode: 'insensitive' } } },
            ],
          }
        : {}),
    } as any

    const [total, docs] = await Promise.all([
      prisma.warishDocument.count({ where }),
      prisma.warishDocument.findMany({
        where,
        include: { warish: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    const items = docs.map((d) => ({
      id: d.id,
      applicantName: d.warish.applicantName,
      nameOfDeceased: d.warish.nameOfDeceased,
      warishRefNo: d.warish.warishRefNo,
      warishRefDate: d.warish.warishRefDate,
      documentUrl: d.cloudinaryUrl,
    }))

    return NextResponse.json({ total, items, page, pageSize })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
