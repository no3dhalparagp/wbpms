"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Role } from "@prisma/client"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: Role[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRoles = [Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN],
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push(redirectTo)
      return
    }

    if (!session.user.isActive) {
      router.push("/auth/error?error=AccessDenied")
      return
    }

    if (!requiredRoles.includes(session.user.role)) {
      router.push("/dashboard")
      return
    }
  }, [session, status, router, requiredRoles, redirectTo])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user || !session.user.isActive || !requiredRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}
