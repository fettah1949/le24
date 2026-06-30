import prisma from "@/lib/db/prisma";
import type { AdSlotId } from "@/lib/ads/slots";

function activeDateFilter() {
  const now = new Date();
  return {
    isActive: true,
    AND: [
      { OR: [{ startDate: null }, { startDate: { lte: now } }] },
      { OR: [{ endDate: null }, { endDate: { gte: now } }] },
    ],
  };
}

export async function getActiveAdBySlot(slot: AdSlotId) {
  return prisma.ad.findFirst({
    where: { slot, ...activeDateFilter() },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getAdminAds() {
  return prisma.ad.findMany({
    orderBy: [{ slot: "asc" }, { priority: "desc" }],
  });
}

export async function getAdminAdById(id: string) {
  return prisma.ad.findUnique({ where: { id } });
}
