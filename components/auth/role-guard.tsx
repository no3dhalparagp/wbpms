"use client"

import { useSession } from "next-auth/react"
import type { Role } from "@prisma/client"
import type { ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: Role[]
  fallback?: ReactNode
  showError?: boolean
}

export function RoleGuard({ children, allowedRoles, fallback = null, showError = false }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  if (!session?.user) {
    return fallback
  }

  if (!allowedRoles.includes(session.user.role)) {
    if (showError) {
      return (
        <Alert className="max-w-md mx-auto">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this content. Required role: {allowedRoles.join(" or ")}.
          </AlertDescription>
        </Alert>
      )
    }
    return fallback
  }

  return <>{children}</>
}
