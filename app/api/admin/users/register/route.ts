import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminRegisterSchema } from "@/schema";
import { getUserEmail, createUser } from "@/data/user";
import { getGramPanchayatById } from "@/data/gram-panchayat";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or super admin role
    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Received user registration data:", body);

    // Validate the request body
    const validatedFields = AdminRegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      console.error("Validation error:", validatedFields.error.issues);
      return NextResponse.json(
        { error: "Invalid input data", details: validatedFields.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, gramPanchayatId, role } =
      validatedFields.data;

    // Check if user already exists
    const existingUser = await getUserEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Verify Gram Panchayat exists
    const gramPanchayat = await getGramPanchayatById(gramPanchayatId);
    if (!gramPanchayat) {
      return NextResponse.json(
        { error: "Gram Panchayat not found" },
        { status: 400 }
      );
    }

    // Enforce that regular ADMIN can only create users for their own GP
    if (session.user.role === "ADMIN") {
      const adminGpId =
        session.user.gramPanchayat?.id ||
        session.user.gramPanchayatId;
      if (!adminGpId || adminGpId !== gramPanchayatId) {
        return NextResponse.json(
          {
            error: "Admins can only create users for their own Gram Panchayat",
          },
          { status: 403 }
        );
      }
    }

    // Enforce that ADMIN cannot create ADMINs (only STAFF), SUPER_ADMIN can create ADMIN/STAFF
    if (session.user.role === "ADMIN" && role === "ADMIN") {
      return NextResponse.json(
        { error: "Admins are only allowed to create STAFF accounts" },
        { status: 403 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      employeeId: body.employeeId,
      designation: body.designation,
      gramPanchayatId,
      role: role as "STAFF" | "ADMIN",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
