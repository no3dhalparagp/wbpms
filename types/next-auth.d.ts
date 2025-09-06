import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
      isActive: boolean
      gramPanchayatId?: string | null
      gramPanchayat?: {
        id: string
        name: string
        code: string
        district: string
        state: string
      } | null
      designation?: string | null
      employeeId?: string | null
    }
  }

  interface User {
    role: Role
    isActive: boolean
    gramPanchayatId?: string | null
    designation?: string | null
    employeeId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    isActive: boolean
    gramPanchayatId?: string | null
    gramPanchayat?: {
      id: string
      name: string
      code: string
      district: string
      state: string
    } | null
    designation?: string | null
    employeeId?: string | null
  }
}
