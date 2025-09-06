import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Role } from "@prisma/client"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[Role.SUPER_ADMIN]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
