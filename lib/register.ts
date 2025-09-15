"use server";

import { prisma } from "./prisma";

export async function register(bidderid: string, emdAmount: number) {
  try {
    const emd = await prisma.earnestMoneyRegister.create({
      data: {
        earnestMoneyAmount: emdAmount,
        bidderId: bidderid,
      },
    });

    return { success: true, emd: emd };
  } catch (error) {
    console.log(error);
  }
}
