"use server";

import { Role } from "@prisma/client"; // Ensure UserRole is imported
import { auth } from "@/auth";
import { prisma } from "./prisma";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

export const currentgpuserlogin = async ()=>{
  const session = await auth();
  return session?.user?.gpid;
}

export const bidagencybyid = async (id: string) => {
  const bidder = await prisma.bidagency.findUnique({
    where: {
      id: id,
    },
    include: {
      agencydetails: true,
    },
  });

  return bidder;
};

export async function getworklenthbynitno(nitno: number, nitid: string) {
  const workLength = await prisma.nitDetails.findUnique({
    where: {
      id: nitid,
      memoNumber: nitno,
    },
    select: {
      WorksDetail: true,
    },
  });

  return workLength?.WorksDetail.length;
}
