import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Role } from "@prisma/client"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
