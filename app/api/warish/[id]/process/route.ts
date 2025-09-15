import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is staff
    if (session.user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status, remarks, warishRefNo, warishRefDate, approvalYear } = await request.json();

    // Validate required fields
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Check if the application exists and is assigned to this staff member
    const existingApplication = await prisma.warishApplication.findFirst({
      where: {
        id: params.id,
        assingstaffId: session.user.id
      }
    });

    if (!existingApplication) {
      return NextResponse.json({ error: "Application not found or not assigned to you" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      warishApplicationStatus: status,
      fieldreportRemark: remarks || null,
      updatedAt: new Date()
    };

    // Add reference information for approved applications
    if (status === 'approved') {
      if (warishRefNo) updateData.warishRefNo = warishRefNo;
      if (warishRefDate) updateData.warishRefDate = new Date(warishRefDate);
      if (approvalYear) updateData.approvalYear = approvalYear;
    }

    // Update the application
    const updatedApplication = await prisma.warishApplication.update({
      where: { id: params.id },
      data: updateData,
      include: {
        gramPanchayat: {
          select: { name: true, district: true, state: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication
    });

  } catch (error) {
    console.error("Error processing Warish application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
