import { Role } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
  rememberMe: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return val === "true" || val === "on";
    }
    return val;
  }).default(false),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password must be less than 32 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum  6 charecter is required",
  }),
  newpassword: z.string().min(6, {
    message: "Minimum  6 charecter is required",
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    phoneNumber: z.string().optional(),
    employeeId: z.string().optional(),
    designation: z.string().optional(),
    gramPanchayatId: z.string().optional(),
    role: z.enum(["STAFF", "ADMIN"]).optional().default("STAFF"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AdminRegisterSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    phoneNumber: z.string().optional(),
    employeeId: z.string().optional(),
    designation: z.string().optional(),
    gramPanchayatId: z.string().min(1, {
      message: "Gram Panchayat is required",
    }),
    role: z.enum(["STAFF", "ADMIN"]).default("STAFF"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([Role.ADMIN, Role.STAFF, Role.SUPER_ADMIN]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New Password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export const heroImageSchema = z.object({
  heroImageDescription: z.string().min(3),
});

export const GramPanchayatSchema = z.object({
  name: z.string().min(1, {
    message: "Gram Panchayat name is required",
  }),
  code: z.string().min(1, {
    message: "GP code is required",
  }),
  state: z.string().min(1, {
    message: "State is required",
  }),
  district: z.string().min(1, {
    message: "District is required",
  }),
  block: z.string().min(1, {
    message: "Block is required",
  }),
  pincode: z.string().optional(),
  address: z.string().optional(),
  population: z.number().optional(),
  area: z.number().optional(),
  sarpanchName: z.string().optional(),
  secretaryName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const userProfileUpdateSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .optional(),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .optional(),
});

export const SearchSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, "Search term cannot be empty")
    .max(100, "Search term is too long"),
});

