import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { RegisterSchema } from "@/schema"
import { getUserEmail, createUser } from "@/data/user"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received registration data:", body)
    
    // Validate the request body
    const validatedFields = RegisterSchema.safeParse(body)
    
    if (!validatedFields.success) {
      console.error("Validation error:", validatedFields.error.issues)
      return NextResponse.json(
        { error: "Invalid input data", details: validatedFields.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await getUserEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the user using the data layer function
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      employeeId: body.employeeId,
      designation: body.designation,
      role: "STAFF", // Default role for new users
    })

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
