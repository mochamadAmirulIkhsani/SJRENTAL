"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseFinancialInput, generateBusinessInsight } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import type { CreateIncomeData, CreateExpenseData, CreateAssetData } from "@/types/financial";

export async function processAiFinancialInput(userInput: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    console.log("Processing input:", userInput);

    // Try AI parsing first
    let parsedData = await parseFinancialInput(userInput);

    // If AI parsing fails, try simple pattern matching
    if (!parsedData) {
      console.log("AI parsing failed, trying fallback...");
      parsedData = fallbackParseFinancialInput(userInput);
    }

    if (!parsedData) {
      return { success: false, message: "Could not understand the financial data from your input. Please try a format like 'Bought fuel for Rp 50000' or 'Received rental payment Rp 200000'." };
    }

    let result;

    switch (parsedData.type) {
      case "income":
        result = await createIncome({
          description: parsedData.description,
          amount: parsedData.amount,
          category: parsedData.category as any,
          source: parsedData.source,
          date: new Date(parsedData.date),
        });
        break;

      case "expense":
        result = await createExpense({
          description: parsedData.description,
          amount: parsedData.amount,
          category: parsedData.category as any,
          vendor: parsedData.vendor,
          date: new Date(parsedData.date),
          motorcycleId: parsedData.motorcycleId,
        });
        break;

      case "asset":
        result = await createAsset({
          name: parsedData.description,
          category: parsedData.category as any,
          value: parsedData.amount,
          purchaseDate: new Date(parsedData.date),
          condition: parsedData.condition,
          location: parsedData.location,
        });
        break;

      default:
        return { success: false, message: "Unknown financial data type." };
    }

    return {
      success: true,
      message: `Successfully added ${parsedData.type}: ${parsedData.description} (Rp ${parsedData.amount.toLocaleString()})`,
      data: result,
    };
  } catch (error) {
    console.error("Error processing AI financial input:", error);
    return { success: false, message: "Failed to process financial data. Please try again." };
  }
}

// Simple fallback parser for common patterns
function fallbackParseFinancialInput(userInput: string): any {
  const input = userInput.toLowerCase().trim();
  const today = new Date().toISOString().split("T")[0];

  console.log("Using fallback parser for:", input);

  // Extract amount from input - support multiple formats
  const amountMatch = input.match(/(?:\$|usd|dollar[s]?|rp|rupiah)?\s*(\d+(?:[,.]?\d{3})*(?:\.\d{2})?)/i) || input.match(/(\d+(?:[,.]?\d{3})*(?:\.\d{2})?)\s*(?:\$|usd|dollar[s]?|rp|rupiah)?/i);

  if (!amountMatch) {
    console.log("No amount found in input");
    return null;
  }

  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  console.log("Extracted amount:", amount);

  // Asset patterns (bought, purchased, acquired)
  if (input.match(/\b(bought|purchased|acquired|got|obtained|new)\b/)) {
    let category = "OTHER";
    let description = "New purchase";

    if (input.match(/\b(toolkit|tools|tool)\b/)) {
      category = "TOOLS";
      description = "New toolkit";
    } else if (input.match(/\b(motorcycle|bike|motor|scooter)\b/)) {
      category = "MOTORCYCLE";
      description = "New motorcycle";
    } else if (input.match(/\b(equipment|gear)\b/)) {
      category = "EQUIPMENT";
      description = "New equipment";
    } else if (input.match(/\b(computer|laptop|phone|tablet|electronics)\b/)) {
      category = "ELECTRONICS";
      description = "New electronics";
    } else if (input.match(/\b(furniture|desk|chair|table)\b/)) {
      category = "FURNITURE";
      description = "New furniture";
    }

    console.log("Parsed as asset:", { description, amount, category });
    return {
      type: "asset",
      description,
      amount,
      category,
      date: today,
      condition: "NEW",
    };
  }

  // Expense patterns (spent, paid, cost)
  if (input.match(/\b(spent|paid|cost|expense|bill|charge)\b/)) {
    let category = "OTHER";
    let description = "Business expense";

    if (input.match(/\b(fuel|gas|gasoline|petrol)\b/)) {
      category = "FUEL";
      description = "Fuel expense";
    } else if (input.match(/\b(maintenance|repair|fix|service)\b/)) {
      category = "MAINTENANCE";
      description = "Maintenance expense";
    } else if (input.match(/\b(insurance|coverage)\b/)) {
      category = "INSURANCE";
      description = "Insurance payment";
    } else if (input.match(/\b(registration|license|permit)\b/)) {
      category = "REGISTRATION";
      description = "Registration fee";
    } else if (input.match(/\b(spare.?parts?|parts?|component)\b/)) {
      category = "SPARE_PARTS";
      description = "Spare parts";
    } else if (input.match(/\b(clean|wash|detailing)\b/)) {
      category = "CLEANING";
      description = "Cleaning expense";
    } else if (input.match(/\b(marketing|advertis|promotion)\b/)) {
      category = "MARKETING";
      description = "Marketing expense";
    } else if (input.match(/\b(office|supply|stationary)\b/)) {
      category = "OFFICE";
      description = "Office expense";
    }

    console.log("Parsed as expense:", { description, amount, category });
    return {
      type: "expense",
      description,
      amount,
      category,
      date: today,
    };
  }

  // Income patterns (received, earned, income, payment)
  if (input.match(/\b(received|earned|income|payment|paid|revenue|money)\b/)) {
    let category = "OTHER";
    let description = "Business income";

    if (input.match(/\b(rental|rent|hire)\b/)) {
      category = "RENTAL_PAYMENT";
      description = "Rental payment";
    } else if (input.match(/\b(deposit|security)\b/)) {
      category = "DEPOSIT";
      description = "Security deposit";
    } else if (input.match(/\b(late|penalty|fine)\b/)) {
      category = "LATE_FEE";
      description = "Late fee";
    } else if (input.match(/\b(damage|repair.?fee)\b/)) {
      category = "DAMAGE_FEE";
      description = "Damage fee";
    }

    console.log("Parsed as income:", { description, amount, category });
    return {
      type: "income",
      description,
      amount,
      category,
      date: today,
    };
  }

  // Default to expense if amount is found but no clear pattern
  console.log("No clear pattern found, defaulting to expense");
  return {
    type: "expense",
    description: `Business transaction - ${userInput}`,
    amount,
    category: "OTHER",
    date: today,
  };
}

export async function createIncome(data: CreateIncomeData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const income = await prisma.income.create({
    data: {
      ...data,
      userId: session.user.id,
    },
    include: {
      rental: {
        include: {
          customer: { select: { name: true } },
          motorcycle: { select: { plateNumber: true } },
        },
      },
    },
  });

  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...income,
    amount: Number(income.amount),
  };
}

export async function createExpense(data: CreateExpenseData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const expense = await prisma.expense.create({
    data: {
      ...data,
      userId: session.user.id,
    },
    include: {
      motorcycle: {
        select: {
          plateNumber: true,
          brand: true,
          model: true,
        },
      },
    },
  });

  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...expense,
    amount: Number(expense.amount),
  };
}

export async function createAsset(data: CreateAssetData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const asset = await prisma.asset.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");

  // Serialize Decimal fields for client components
  return {
    ...asset,
    value: Number(asset.value),
  };
}

export async function getFinancialSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [income, expenses, assets, rentals, motorcycles] = await Promise.all([
    prisma.income.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
    }),
    prisma.asset.aggregate({
      where: { userId: session.user.id },
      _sum: { value: true },
    }),
    prisma.rental.count({
      where: { status: "ACTIVE" },
    }),
    prisma.motorcycle.count({
      where: { status: "AVAILABLE" },
    }),
  ]);

  const totalIncome = Number(income._sum.amount) || 0;
  const totalExpenses = Number(expenses._sum.amount) || 0;

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalAssets: Number(assets._sum.value) || 0,
    activeRentals: rentals,
    availableMotorcycles: motorcycles,
  };
}

export async function generateAiInsights() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const summary = await getFinancialSummary();

    const recentTransactions = await prisma.income.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        description: true,
        amount: true,
        category: true,
        date: true,
      },
    });

    const insight = await generateBusinessInsight({
      ...summary,
      totalMotorcycles: summary.availableMotorcycles,
      recentTransactions,
    });

    const aiInsight = await prisma.aiInsight.create({
      data: {
        title: "Business Performance Analysis",
        content: insight,
        category: "FINANCIAL_TREND",
        priority: "MEDIUM",
        userId: session.user.id,
        data: summary,
      },
    });

    revalidatePath("/dashboard");
    return aiInsight;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error("Failed to generate insights");
  }
}

export async function getRecentTransactions() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [recentIncome, recentExpenses] = await Promise.all([
    prisma.income.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        rental: {
          include: {
            customer: { select: { name: true } },
            motorcycle: { select: { plateNumber: true } },
          },
        },
      },
    }),
    prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        motorcycle: {
          select: {
            plateNumber: true,
            brand: true,
            model: true,
          },
        },
      },
    }),
  ]);

  // Serialize Decimal fields for client components
  return {
    income: recentIncome.map((item) => ({
      ...item,
      amount: Number(item.amount),
    })),
    expenses: recentExpenses.map((item) => ({
      ...item,
      amount: Number(item.amount),
    })),
  };
}
