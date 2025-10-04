"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/paginate";
import { revalidatePath } from "next/cache";
import type { CreateMotorcycleData, UpdateMotorcycleData } from "@/types/motorcycle";

export async function createMotorcycle(data: CreateMotorcycleData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const motorcycle = await prisma.motorcycle.create({
    data: {
      ...data,
      dailyRate: data.dailyRate.toString(), // Convert to Decimal
    },
  });

  revalidatePath("/dashboard/motorcycles");

  // Serialize Decimal fields for client components
  return {
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate),
  };
}

export async function updateMotorcycle(id: string, data: UpdateMotorcycleData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const updateData: any = { ...data };
  if (data.dailyRate) {
    updateData.dailyRate = data.dailyRate.toString();
  }

  const motorcycle = await prisma.motorcycle.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard/motorcycles");

  // Serialize Decimal fields for client components
  return {
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate),
  };
}

export async function deleteMotorcycle(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if motorcycle has active rentals
  const activeRentals = await prisma.rental.count({
    where: {
      motorcycleId: id,
      status: "ACTIVE",
    },
  });

  if (activeRentals > 0) {
    throw new Error("Cannot delete motorcycle with active rentals");
  }

  await prisma.motorcycle.delete({
    where: { id },
  });

  revalidatePath("/dashboard/motorcycles");
}

export async function getMotorcycles() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const motorcycles = await prisma.motorcycle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rentals: {
            where: {
              status: "ACTIVE",
            },
          },
        },
      },
    },
  });

  // Serialize Decimal fields for client components
  return motorcycles.map((motorcycle) => ({
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate), // Convert Decimal to number
  }));
}

export async function getMotorcyclesPaginated(page: number = 1, perPage: number = 10, search?: string, status?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Build where clause for filtering
  const where: any = {};

  if (search) {
    where.OR = [{ brand: { contains: search, mode: "insensitive" } }, { model: { contains: search, mode: "insensitive" } }, { plateNumber: { contains: search, mode: "insensitive" } }];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  const result = await paginate(prisma.motorcycle, {
    page,
    perPage,
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rentals: {
            where: {
              status: "ACTIVE",
            },
          },
        },
      },
    },
  });

  // Serialize Decimal fields for client components
  return {
    ...result,
    data: result.data.map((motorcycle: any) => ({
      ...motorcycle,
      dailyRate: Number(motorcycle.dailyRate),
    })),
  };
}

export async function getMotorcycleById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const motorcycle = await prisma.motorcycle.findUnique({
    where: { id },
    include: {
      rentals: {
        include: {
          customer: true,
        },
        orderBy: { createdAt: "desc" },
      },
      expenses: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!motorcycle) return null;

  // Serialize Decimal fields for client components
  return {
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate),
    rentals: motorcycle.rentals.map((rental) => ({
      ...rental,
      dailyRate: Number(rental.dailyRate),
      deposit: Number(rental.deposit),
      totalAmount: rental.totalAmount ? Number(rental.totalAmount) : null,
    })),
    expenses: motorcycle.expenses.map((expense) => ({
      ...expense,
      amount: Number(expense.amount),
    })),
  };
}

export async function getAvailableMotorcycles() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const motorcycles = await prisma.motorcycle.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: { brand: "asc" },
  });

  // Serialize Decimal fields for client components
  return motorcycles.map((motorcycle) => ({
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate),
  }));
}

export async function updateMotorcycleStatus(id: string, status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE") {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const motorcycle = await prisma.motorcycle.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/motorcycles");
  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...motorcycle,
    dailyRate: Number(motorcycle.dailyRate),
  };
}
