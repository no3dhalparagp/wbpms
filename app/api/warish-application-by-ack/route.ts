import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParam = req.nextUrl.searchParams.get("search");
  
  if (!searchParam) {
    return NextResponse.json(
      { error: "Search parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Try to find by acknowledgment number first
    let app = await prisma.warishApplication.findUnique({
      where: { acknowlegment: searchParam },
      include: { warishDetails: true },
    });

    // If not found by acknowledgment, try by reference number
    if (!app) {
      app = await prisma.warishApplication.findFirst({
        where: { 
          referenceNumber: searchParam 
        },
        include: { warishDetails: true },
      });
    }

    return NextResponse.json({ app });
  } catch (error) {
    console.error("Error searching for application:", error);
    return NextResponse.json(
      { error: "Failed to search for application" },
      { status: 500 }
    );
  }
}
