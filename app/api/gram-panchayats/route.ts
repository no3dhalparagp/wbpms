import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const gramPanchayats = await prisma.gramPanchayat.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        state: true,
        district: true,
        block: true,
        pincode: true,
        address: true,
        population: true,
        area: true,
        sarpanchName: true,
        secretaryName: true,
        phoneNumber: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            villages: true,
            wards: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(gramPanchayats);
  } catch (error) {
    console.error("Error fetching Gram Panchayats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
      email
    } = await request.json();

    // Validate required fields
    if (!name || !code || !state || !district || !block) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Check if GP code already exists
    const existingGP = await prisma.gramPanchayat.findUnique({
      where: { code }
    });

    if (existingGP) {
      return NextResponse.json({ 
        error: "GP code already exists" 
      }, { status: 400 });
    }

    // Create the Gram Panchayat
    const gramPanchayat = await prisma.gramPanchayat.create({
      data: {
        name,
        code,
        state,
        district,
        block,
        pincode: pincode || null,
        address: address || null,
        population: population || null,
        area: area || null,
        sarpanchName: sarpanchName || null,
        secretaryName: secretaryName || null,
        phoneNumber: phoneNumber || null,
        email: email || null,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      gramPanchayat
    });

  } catch (error) {
    console.error("Error creating Gram Panchayat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
