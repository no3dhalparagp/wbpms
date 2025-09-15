import { prisma } from "@/lib/prisma";

export const createGramPanchayat = async (gpData: {
  name: string;
  code: string;
  state: string;
  district: string;
  block: string;
  pincode?: string;
  address?: string;
  population?: number;
  area?: number;
  sarpanchName?: string;
  secretaryName?: string;
  phoneNumber?: string;
  email?: string;
}) => {
  try {
    const gramPanchayat = await prisma.gramPanchayat.create({
      data: {
        name: gpData.name,
        code: gpData.code,
        state: gpData.state,
        district: gpData.district,
        block: gpData.block,
        pincode: gpData.pincode,
        address: gpData.address,
        population: gpData.population,
        area: gpData.area,
        sarpanchName: gpData.sarpanchName,
        secretaryName: gpData.secretaryName,
        phoneNumber: gpData.phoneNumber,
        email: gpData.email,
        isActive: true,
      },
    });

    return gramPanchayat;
  } catch (error) {
    console.error("Error creating Gram Panchayat:", error);
    return null;
  }
};

export const getGramPanchayatByCode = async (code: string) => {
  try {
    const gramPanchayat = await prisma.gramPanchayat.findUnique({
      where: { code },
    });
    return gramPanchayat;
  } catch (error) {
    console.error("Error fetching Gram Panchayat by code:", error);
    return null;
  }
};

export const getGramPanchayatById = async (id: string) => {
  try {
    const gramPanchayat = await prisma.gramPanchayat.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            designation: true,
            isActive: true,
          },
        },
        villages: true,
        wards: true,
      },
    });
    return gramPanchayat;
  } catch (error) {
    console.error("Error fetching Gram Panchayat by ID:", error);
    return null;
  }
};

export const getAllGramPanchayats = async () => {
  try {
    const gramPanchayats = await prisma.gramPanchayat.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        state: true,
        district: true,
        block: true,
        pincode: true,
        address: true,
        population: true,
        area: true,
        sarpanchName: true,
        secretaryName: true,
        phoneNumber: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            villages: true,
            wards: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return gramPanchayats;
  } catch (error) {
    console.error("Error fetching all Gram Panchayats:", error);
    return null;
  }
};

export const updateGramPanchayat = async (id: string, updateData: {
  name?: string;
  code?: string;
  state?: string;
  district?: string;
  block?: string;
  pincode?: string;
  address?: string;
  population?: number;
  area?: number;
  sarpanchName?: string;
  secretaryName?: string;
  phoneNumber?: string;
  email?: string;
  isActive?: boolean;
}) => {
  try {
    const gramPanchayat = await prisma.gramPanchayat.update({
      where: { id },
      data: updateData,
    });
    return gramPanchayat;
  } catch (error) {
    console.error("Error updating Gram Panchayat:", error);
    return null;
  }
};

export const deleteGramPanchayat = async (id: string) => {
  try {
    const gramPanchayat = await prisma.gramPanchayat.update({
      where: { id },
      data: { isActive: false },
    });
    return gramPanchayat;
  } catch (error) {
    console.error("Error deleting Gram Panchayat:", error);
    return null;
  }
};
