import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, designation, employeeId, phoneNumber, aadharNumber } = await request.json();

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        designation: designation || null,
        employeeId: employeeId || null,
        phoneNumber: phoneNumber || null,
        aadharNumber: aadharNumber || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        designation: true,
        employeeId: true,
        phoneNumber: true,
        aadharNumber: true,
        joiningDate: true,
        gramPanchayat: {
          select: { name: true, district: true, state: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
