import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.warishApplication.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        acknowlegment: true,
        applicantName: true,
        nameOfDeceased: true,
        dateOfDeath: true,
        reportingDate: true,
        warishApplicationStatus: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
} 