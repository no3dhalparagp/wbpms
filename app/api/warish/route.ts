import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      reportingDate,
      acknowlegment,
      applicantName,
      applicantMobileNumber,
      relationwithdeceased,
      nameOfDeceased,
      dateOfDeath,
      gender,
      maritialStatus,
      fatherName,
      spouseName,
      villageName,
      postOffice,
      familyMembers
    } = await request.json();

    // Validate required fields
    if (!acknowlegment || !applicantName || !nameOfDeceased || !dateOfDeath) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Check if acknowledgment number already exists
    const existingApplication = await prisma.warishApplication.findUnique({
      where: { acknowlegment }
    });

    if (existingApplication) {
      return NextResponse.json({ 
        error: "Acknowledgment number already exists" 
      }, { status: 400 });
    }

    // Create the Warish application
    const warishApplication = await prisma.warishApplication.create({
      data: {
        reportingDate: new Date(reportingDate),
        acknowlegment,
        applicantName,
        applicantMobileNumber,
        relationwithdeceased,
        nameOfDeceased,
        dateOfDeath: new Date(dateOfDeath),
        gender,
        maritialStatus,
        fatherName,
        spouseName: spouseName || null,
        villageName,
        postOffice,
        gramPanchayatId: session.user.gramPanchayatId!,
        userId: session.user.id,
        warishDetails: {
          create: familyMembers.map((member: any) => ({
            name: member.name,
            gender: member.gender,
            relation: member.relation,
            livingStatus: member.livingStatus,
            maritialStatus: member.maritalStatus,
            hasbandName: member.husbandName || null
          }))
        }
      },
      include: {
        gramPanchayat: {
          select: { name: true, district: true, state: true }
        },
        warishDetails: true
      }
    });

    return NextResponse.json({
      success: true,
      application: warishApplication
    });

  } catch (error) {
    console.error("Error creating Warish application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
