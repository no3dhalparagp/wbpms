"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"
import type { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateUserRoleAdmin(userId: string, newRole: Role) {
  await requireAdmin()

  // Admins cannot create SUPER_ADMIN users
  if (newRole === "SUPER_ADMIN") {
    throw new Error("Insufficient permissions to create Super Admin users")
  }

  try {
    // Check if the target user is a SUPER_ADMIN (admins cannot modify super admins)
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (targetUser?.role === "SUPER_ADMIN") {
      throw new Error("Cannot modify Super Admin users")
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user role:", error)
    throw new Error("Failed to update user role")
  }
}

export async function toggleUserStatusAdmin(userId: string) {
  await requireAdmin()

  try {
    // Check if the target user is a SUPER_ADMIN (admins cannot modify super admins)
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    })

    if (!targetUser) {
      throw new Error("User not found")
    }

    if (targetUser.role === "SUPER_ADMIN") {
      throw new Error("Cannot modify Super Admin users")
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !targetUser.isActive },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle user status:", error)
    throw new Error("Failed to toggle user status")
  }
}
