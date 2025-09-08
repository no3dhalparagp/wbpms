import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;
    const userGpId = (session.user as any).gramPanchayatId || (session.user as any).gramPanchayat?.id;

    if (userRole !== "SUPER_ADMIN" && params.id !== userGpId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const gp = await prisma.gramPanchayat.findUnique({ where: { id: params.id } });
    if (!gp) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(gp);
  } catch (error) {
    console.error("Error fetching Gram Panchayat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      code,
      state,
      district,
      block,
      pincode,
      address,
      population,
      area,
      sarpanchName,
      secretaryName,
      phoneNumber,
      email,
      isActive,
    } = body || {};

    // Validate minimal required fields if provided
    const updateData: any = {};
    if (name !== undefined) updateData.name = String(name);
    if (code !== undefined) updateData.code = String(code);
    if (state !== undefined) updateData.state = String(state);
    if (district !== undefined) updateData.district = String(district);
    if (block !== undefined) updateData.block = String(block);
    if (pincode !== undefined) updateData.pincode = pincode ? String(pincode) : null;
    if (address !== undefined) updateData.address = address ? String(address) : null;
    if (population !== undefined)
      updateData.population = population === null || population === ""
        ? null
        : Number(population);
    if (area !== undefined)
      updateData.area = area === null || area === "" ? null : Number(area);
    if (sarpanchName !== undefined) updateData.sarpanchName = sarpanchName ? String(sarpanchName) : null;
    if (secretaryName !== undefined) updateData.secretaryName = secretaryName ? String(secretaryName) : null;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber ? String(phoneNumber) : null;
    if (email !== undefined) updateData.email = email ? String(email) : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // If code is updated, ensure uniqueness
    if (updateData.code) {
      const existing = await prisma.gramPanchayat.findUnique({ where: { code: updateData.code } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ error: "GP code already exists" }, { status: 400 });
      }
    }

    const updated = await prisma.gramPanchayat.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json({ success: true, gramPanchayat: updated });
  } catch (error) {
    console.error("Error updating Gram Panchayat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

