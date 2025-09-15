import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

export async function getRequiredServerSession() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  if (!session.user.isActive) {
    redirect("/auth/error?error=AccessDenied")
  }

  return session
}

export async function requireRole(requiredRoles: Role[]) {
  const session = await getRequiredServerSession()

  if (!requiredRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return session
}

export async function requireSuperAdmin() {
  return await requireRole([Role.SUPER_ADMIN])
}

export async function requireAdmin() {
  return await requireRole([Role.ADMIN, Role.SUPER_ADMIN])
}

export async function requireStaff() {
  return await requireRole([Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN])
}

export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isSuperAdmin(userRole: Role): boolean {
  return userRole === Role.SUPER_ADMIN
}

export function isAdmin(userRole: Role): boolean {
  return [Role.ADMIN, Role.SUPER_ADMIN].includes(userRole)
}

export function isStaff(userRole: Role): boolean {
  return [Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN].includes(userRole)
}
