import { NextRequest, NextResponse } from "next/server"
import { getAllGramPanchayats } from "@/data/gram-panchayat"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has admin or super admin role
    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      )
    }

    const gramPanchayats = await getAllGramPanchayats()

    if (!gramPanchayats) {
      return NextResponse.json(
        { error: "Failed to fetch Gram Panchayats" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        gramPanchayats 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error fetching Gram Panchayats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
