"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/paginate";
import { revalidatePath } from "next/cache";
import type { CreateRentalData, CreateCustomerData } from "@/types/rental";

export async function createCustomer(data: CreateCustomerData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const customer = await prisma.customer.create({
    data,
  });

  revalidatePath("/dashboard/customers");
  return customer;
}

export async function createRental(data: CreateRentalData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Start a transaction to ensure consistency
  const result = await prisma.$transaction(async (tx) => {
    // Check if motorcycle is available
    const motorcycle = await tx.motorcycle.findUnique({
      where: { id: data.motorcycleId },
    });

    if (!motorcycle || motorcycle.status !== "AVAILABLE") {
      throw new Error("Motorcycle is not available for rental");
    }

    // Create the rental
    const rental = await tx.rental.create({
      data: {
        ...data,
        dailyRate: data.dailyRate.toString(),
        deposit: data.deposit.toString(),
      },
      include: {
        motorcycle: true,
        customer: true,
      },
    });

    // Update motorcycle status to RENTED
    await tx.motorcycle.update({
      where: { id: data.motorcycleId },
      data: { status: "RENTED" },
    });

    // Create income record for deposit
    await tx.income.create({
      data: {
        description: `Deposit for rental - ${motorcycle.brand} ${motorcycle.model} (${motorcycle.plateNumber})`,
        amount: data.deposit.toString(),
        category: "DEPOSIT",
        date: data.startDate,
        rentalId: rental.id,
        userId: session.user.id!,
      },
    });

    return rental;
  });

  revalidatePath("/dashboard/rentals");
  revalidatePath("/dashboard/motorcycles");
  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...result,
    dailyRate: Number(result.dailyRate),
    deposit: Number(result.deposit),
    totalAmount: result.totalAmount ? Number(result.totalAmount) : null,
    motorcycle: {
      ...result.motorcycle,
      dailyRate: Number(result.motorcycle.dailyRate),
    },
  };
}

export async function completeRental(id: string, totalAmount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Get the rental
    const rental = await tx.rental.findUnique({
      where: { id },
      include: { motorcycle: true, customer: true },
    });

    if (!rental) {
      throw new Error("Rental not found");
    }

    // Update rental
    const updatedRental = await tx.rental.update({
      where: { id },
      data: {
        status: "COMPLETED",
        endDate: new Date(),
        totalAmount: totalAmount.toString(),
      },
    });

    // Update motorcycle status back to AVAILABLE
    await tx.motorcycle.update({
      where: { id: rental.motorcycleId },
      data: { status: "AVAILABLE" },
    });

    // Create income record for final payment (minus deposit)
    const finalPayment = totalAmount - Number(rental.deposit);
    if (finalPayment > 0) {
      await tx.income.create({
        data: {
          description: `Rental payment - ${rental.motorcycle.brand} ${rental.motorcycle.model} (${rental.motorcycle.plateNumber})`,
          amount: finalPayment.toString(),
          category: "RENTAL_PAYMENT",
          date: new Date(),
          rentalId: rental.id,
          userId: session.user.id!,
        },
      });
    }

    return updatedRental;
  });

  revalidatePath("/dashboard/rentals");
  revalidatePath("/dashboard/motorcycles");
  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...result,
    dailyRate: Number(result.dailyRate),
    deposit: Number(result.deposit),
    totalAmount: result.totalAmount ? Number(result.totalAmount) : null,
  };
}

export async function cancelRental(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.$transaction(async (tx) => {
    const rental = await tx.rental.findUnique({
      where: { id },
    });

    if (!rental) {
      throw new Error("Rental not found");
    }

    // Update rental status
    const updatedRental = await tx.rental.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Update motorcycle status back to AVAILABLE
    await tx.motorcycle.update({
      where: { id: rental.motorcycleId },
      data: { status: "AVAILABLE" },
    });

    return updatedRental;
  });

  revalidatePath("/dashboard/rentals");
  revalidatePath("/dashboard/motorcycles");
  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...result,
    dailyRate: Number(result.dailyRate),
    deposit: Number(result.deposit),
    totalAmount: result.totalAmount ? Number(result.totalAmount) : null,
  };
}

export async function getRentals() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rentals = await prisma.rental.findMany({
    include: {
      motorcycle: {
        select: {
          brand: true,
          model: true,
          plateNumber: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Decimal fields for client components
  return rentals.map((rental) => ({
    ...rental,
    dailyRate: Number(rental.dailyRate),
    deposit: Number(rental.deposit),
    totalAmount: rental.totalAmount ? Number(rental.totalAmount) : null,
  }));
}

export async function getRentalsPaginated(page: number = 1, perPage: number = 10, search?: string, status?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Build where clause for filtering
  const where: any = {};

  if (search) {
    where.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { phone: { contains: search, mode: "insensitive" } } },
      { motorcycle: { brand: { contains: search, mode: "insensitive" } } },
      { motorcycle: { model: { contains: search, mode: "insensitive" } } },
      { motorcycle: { plateNumber: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  const result = await paginate(prisma.rental, {
    page,
    perPage,
    where,
    orderBy: { createdAt: "desc" },
    include: {
      motorcycle: {
        select: {
          brand: true,
          model: true,
          plateNumber: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });

  // Serialize Decimal fields for client components
  return {
    ...result,
    data: result.data.map((rental: any) => ({
      ...rental,
      dailyRate: Number(rental.dailyRate),
      deposit: Number(rental.deposit),
      totalAmount: rental.totalAmount ? Number(rental.totalAmount) : null,
    })),
  };
}

export async function getActiveRentals() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rentals = await prisma.rental.findMany({
    where: { status: "ACTIVE" },
    include: {
      motorcycle: {
        select: {
          brand: true,
          model: true,
          plateNumber: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });

  // Serialize Decimal fields for client components
  return rentals.map((rental) => ({
    ...rental,
    dailyRate: Number(rental.dailyRate),
    deposit: Number(rental.deposit),
    totalAmount: rental.totalAmount ? Number(rental.totalAmount) : null,
  }));
}

export async function getCustomers() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: {
          rentals: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return customers;
}

export async function getCustomersPaginated(page: number = 1, perPage: number = 10, search?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Build where clause for filtering
  const where: any = {};

  if (search) {
    where.OR = [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }, { phone: { contains: search, mode: "insensitive" } }, { licenseNumber: { contains: search, mode: "insensitive" } }];
  }

  const result = await paginate(prisma.customer, {
    page,
    perPage,
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rentals: true,
        },
      },
    },
  });

  return result;
}

export async function getOverdueRentals() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const now = new Date();

  // Mark overdue rentals
  await prisma.rental.updateMany({
    where: {
      status: "ACTIVE",
      plannedEndDate: {
        lt: now,
      },
    },
    data: {
      status: "OVERDUE",
    },
  });

  const overdueRentals = await prisma.rental.findMany({
    where: { status: "OVERDUE" },
    include: {
      motorcycle: {
        select: {
          brand: true,
          model: true,
          plateNumber: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: { plannedEndDate: "asc" },
  });

  // Serialize Decimal fields for client components
  return overdueRentals.map((rental) => ({
    ...rental,
    dailyRate: Number(rental.dailyRate),
    deposit: Number(rental.deposit),
    totalAmount: rental.totalAmount ? Number(rental.totalAmount) : null,
  }));
}
