import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              role: true,
              isActive: true,
              gramPanchayatId: true,
              designation: true,
              employeeId: true,
            },
            include: {
              gramPanchayat: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  district: true,
                  state: true,
                },
              },
            },
          })

          session.user.id = user.id
          session.user.role = dbUser?.role || Role.STAFF
          session.user.isActive = dbUser?.isActive || true
          session.user.gramPanchayatId = dbUser?.gramPanchayatId
          session.user.gramPanchayat = dbUser?.gramPanchayat
          session.user.designation = dbUser?.designation
          session.user.employeeId = dbUser?.employeeId
        } catch (error) {
          console.error("Session callback error:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              role: true,
              isActive: true,
              gramPanchayatId: true,
              designation: true,
              employeeId: true,
            },
            include: {
              gramPanchayat: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  district: true,
                  state: true,
                },
              },
            },
          })

          token.id = user.id
          token.role = dbUser?.role || Role.STAFF
          token.isActive = dbUser?.isActive || true
          token.gramPanchayatId = dbUser?.gramPanchayatId
          token.gramPanchayat = dbUser?.gramPanchayat
          token.designation = dbUser?.designation
          token.employeeId = dbUser?.employeeId
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }
      return token
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          // User will be created automatically by the adapter if they don't exist
          return true
        } catch (error) {
          console.error("Sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
}
