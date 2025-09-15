import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SUPER_ADMIN can see all; ADMIN limited to own GP
    const whereClause = session.user.role === "ADMIN"
      ? { gramPanchayatId: (session.user as any).gramPanchayatId || (session.user as any).gramPanchayat?.id }
      : {};

    const villages = await prisma.village.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        code: true,
        gramPanchayatId: true,
        population: true,
        area: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ villages });
  } catch (error) {
    console.error("GET /api/admin/villages error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      code,
      gramPanchayatId,
      population,
      area,
    } = body || {};

    if (!name || !gramPanchayatId) {
      return NextResponse.json({ error: "name and gramPanchayatId are required" }, { status: 400 });
    }

    // If ADMIN, enforce creation only in own GP
    if (session.user.role === "ADMIN") {
      const adminGpId = (session.user as any).gramPanchayatId || (session.user as any).gramPanchayat?.id;
      if (!adminGpId || adminGpId !== gramPanchayatId) {
        return NextResponse.json({ error: "Admins can only create villages for their own Gram Panchayat" }, { status: 403 });
      }
    }

    const created = await prisma.village.create({
      data: {
        name,
        code: code || null,
        gramPanchayatId,
        population: typeof population === "number" ? population : null,
        area: typeof area === "number" ? area : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, village: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/villages error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

