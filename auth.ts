import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";

import { Role } from "@prisma/client";
import { Adapter as CoreAdapter } from "@auth/core/adapters";
import { prisma } from "./lib/prisma";
import { getUserById } from "./data/user";
import { getAccountUserId } from "./data/account";
const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (!user) {
        // Handle the case where user is undefined
        return;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const id = user.id;

      const exitingUser = await getUserById(id);

      if (!exitingUser) return false;

      // Check if user account is active
      if (!exitingUser.isActive) {
        console.error("Sign in blocked: User account is inactive", id);
        return false;
      }

      // Check if email is verified
      if (!exitingUser.emailVerified) {
        console.error("Sign in blocked: Email not verified", id);
        return false;
      }

      // Update last login time
      try {
        await prisma.user.update({
          where: { id: id },
          data: { updatedAt: new Date() },
        });
      } catch (error) {
        console.error("Error updating last login time:", error);
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (session.user && token.email !== undefined && token.email !== null) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      // Add additional user fields
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled || false;
        session.user.isOAuth = token.isOAuth || false;
        session.user.isActive = token.isActive || true;
        session.user.gramPanchayatId = token.gramPanchayatId;
        session.user.designation = token.designation;
        session.user.employeeId = token.employeeId;
        session.user.phoneNumber = token.phoneNumber;
        session.user.aadharNumber = token.aadharNumber;
        session.user.joiningDate = token.joiningDate;
        session.user.gramPanchayat = token.gramPanchayat;
        session.user.subscriptionLevel = token.subscriptionLevel as any;
      }

      return session;
    },

    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        // Set extended session duration if remember me is checked
        if (user.rememberMe) {
          token.maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
        }
      }

      if (!token.sub) return token;

      const exitingUser = await getUserById(token.sub);

      if (!exitingUser) return token;

      const exitingAccount = await getAccountUserId(exitingUser.id);

      token.isOAuth = !!exitingAccount;
      token.name = exitingUser.name;
      token.email = exitingUser.email;
      token.role = exitingUser.role;
      token.isTwoFactorEnabled = false; // Default to false, can be enhanced later
      token.isActive = exitingUser.isActive;
      token.gramPanchayatId = exitingUser.gramPanchayatId;
      token.designation = exitingUser.designation;
      token.employeeId = exitingUser.employeeId;
      token.phoneNumber = exitingUser.phoneNumber;
      token.aadharNumber = exitingUser.aadharNumber;
      token.joiningDate = exitingUser.joiningDate;

      // Fetch gram panchayat details if available
      if (exitingUser.gramPanchayatId) {
        try {
          const gramPanchayat = await prisma.gramPanchayat.findUnique({
            where: { id: exitingUser.gramPanchayatId },
            select: {
              id: true,
              name: true,
              code: true,
              district: true,
              state: true,
              subscriptionLevel: true,
            },
          });
          token.gramPanchayat = gramPanchayat;
          token.subscriptionLevel = (gramPanchayat as any)?.subscriptionLevel || 'BASIC';
        } catch (error) {
          console.error("Error fetching gram panchayat:", error);
        }
      }

      return token;
    },
  },

  adapter: PrismaAdapter(prisma) as CoreAdapter,
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes in seconds (default)
  },
  ...authConfig,
});

export { handlers, auth, signIn, signOut, unstable_update };
