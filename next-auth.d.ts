import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import type { User } from "next-auth";
import "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  isActive: boolean;
  gramPanchayatId?: string;
  designation?: string;
  employeeId?: string;
  phoneNumber?: string;
  aadharNumber?: string;
  joiningDate?: Date;
  gramPanchayat?: {
    id: string;
    name: string;
    code: string;
    district: string;
    state: string;
  };
  subscriptionLevel?: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    isActive: boolean;
    gramPanchayatId?: string;
    designation?: string;
    employeeId?: string;
    phoneNumber?: string;
    aadharNumber?: string;
    joiningDate?: Date;
    gramPanchayat?: {
      id: string;
      name: string;
      code: string;
      district: string;
      state: string;
    };
    subscriptionLevel?: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
  }
}
