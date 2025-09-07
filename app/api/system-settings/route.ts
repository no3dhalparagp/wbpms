import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany()
    const map = Object.fromEntries(
      settings.map((s: { key: string; boolValue: boolean | null; value: string | null }) => [
        s.key,
        s.boolValue ?? (s.value === "true"),
      ])
    )
    return NextResponse.json({ settings: map })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const entries = Object.entries(body ?? {}) as [string, unknown][]

    const updates = await Promise.all(
      entries.map(async ([key, rawValue]) => {
        const boolValue =
          typeof rawValue === "boolean" ? rawValue : String(rawValue) === "true"
        return prisma.systemSetting.upsert({
          where: { key },
          update: { boolValue, value: String(boolValue) },
          create: { key, boolValue, value: String(boolValue) },
        })
      })
    )

    const map = Object.fromEntries(
      updates.map((s: { key: string; boolValue: boolean | null; value: string | null }) => [
        s.key,
        s.boolValue ?? (s.value === "true"),
      ])
    )
    return NextResponse.json({ settings: map })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

