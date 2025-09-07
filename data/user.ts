import { prisma } from "@/lib/prisma";

export const getUserEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string | undefined) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByUserRole = async () => {
  try {
    const user = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
    return user;
  } catch (error) {}
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  employeeId?: string;
  designation?: string;
  gramPanchayatId?: string;
  role?: "STAFF" | "ADMIN" | "SUPER_ADMIN";
}) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        employeeId: userData.employeeId,
        designation: userData.designation,
        gramPanchayatId: userData.gramPanchayatId,
        role: userData.role || "STAFF",
        isActive: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Curren active prodhan
