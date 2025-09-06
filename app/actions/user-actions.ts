"use server"

import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth-utils"
import type { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: Role) {
  await requireSuperAdmin()

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/super-admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user role:", error)
    throw new Error("Failed to update user role")
  }
}

export async function toggleUserStatus(userId: string) {
  await requireSuperAdmin()

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    })

    revalidatePath("/super-admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle user status:", error)
    throw new Error("Failed to toggle user status")
  }
}
