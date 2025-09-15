import { NextRequest, NextResponse } from "next/server"
import { GramPanchayatSchema } from "@/schema"
import { createGramPanchayat, getGramPanchayatByCode } from "@/data/gram-panchayat"
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    console.log("Received GP registration data:", body)
    
    // Validate the request body
    const validatedFields = GramPanchayatSchema.safeParse(body)
    
    if (!validatedFields.success) {
      console.error("Validation error:", validatedFields.error.issues)
      return NextResponse.json(
        { error: "Invalid input data", details: validatedFields.error.issues },
        { status: 400 }
      )
    }

    const gpData = validatedFields.data

    // Check if GP with this code already exists
    const existingGP = await getGramPanchayatByCode(gpData.code)
    if (existingGP) {
      return NextResponse.json(
        { error: "Gram Panchayat with this code already exists" },
        { status: 400 }
      )
    }

    // Create the Gram Panchayat
    const gramPanchayat = await createGramPanchayat(gpData)

    if (!gramPanchayat) {
      return NextResponse.json(
        { error: "Failed to create Gram Panchayat" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: "Gram Panchayat created successfully", 
        gramPanchayat 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("GP registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
