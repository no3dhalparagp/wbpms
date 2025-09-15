import { NextRequest, NextResponse } from "next/server";
import {
  getAllGramPanchayats,
  getGramPanchayatById,
} from "@/data/gram-panchayat";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    // SUPER_ADMIN: return all active GPs
    if (session.user.role === "SUPER_ADMIN") {
      const gramPanchayats = await getAllGramPanchayats();
      if (!gramPanchayats) {
        return NextResponse.json(
          { error: "Failed to fetch Gram Panchayats" },
          { status: 500 }
        );
      }
      return NextResponse.json({ gramPanchayats }, { status: 200 });
    }

    // ADMIN: return only their assigned GP
    const adminGpId =
      (session.user as any).gramPanchayatId ||
      (session.user as any).gramPanchayat?.id;

    if (!adminGpId) {
      return NextResponse.json(
        { error: "Admin is not assigned to a Gram Panchayat" },
        { status: 400 }
      );
    }

    const gp = await getGramPanchayatById(adminGpId);
    if (!gp) {
      return NextResponse.json(
        { error: "Assigned Gram Panchayat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ gramPanchayats: [gp] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Gram Panchayats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
